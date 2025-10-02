-- Triggers and functions for business logic

-- Function to award XP on verified attendance checkout
CREATE OR REPLACE FUNCTION award_xp_on_checkout()
RETURNS TRIGGER AS $$
DECLARE
    hours_worked DECIMAL(4,2);
    xp_per_hour INTEGER := 100; -- 100 XP per hour
    xp_earned INTEGER;
BEGIN
    -- Only award XP when checkout is completed and supervisor verified
    IF NEW.check_out_time IS NOT NULL AND NEW.supervisor_verified = true AND OLD.supervisor_verified = false THEN
        -- Calculate hours worked
        hours_worked := EXTRACT(EPOCH FROM (NEW.check_out_time - NEW.check_in_time)) / 3600;
        
        -- Update hours_worked in attendance record
        UPDATE attendance 
        SET hours_worked = hours_worked 
        WHERE id = NEW.id;
        
        -- Calculate XP earned (minimum 1 hour for any XP)
        IF hours_worked >= 0.5 THEN -- Minimum 30 minutes
            xp_earned := GREATEST(1, ROUND(hours_worked * xp_per_hour));
            
            -- Insert XP event
            INSERT INTO xp_events (user_id, event_type, xp_amount, description, reference_id, reference_type)
            VALUES (
                NEW.user_id, 
                'volunteer_hours', 
                xp_earned, 
                'Volunteer hours completed: ' || hours_worked || ' hours',
                NEW.id,
                'attendance'
            );
            
            -- Check for badge eligibility
            PERFORM check_badge_eligibility(NEW.user_id);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for XP awarding
CREATE TRIGGER trigger_award_xp_on_checkout
    AFTER UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION award_xp_on_checkout();

-- Function to check badge eligibility
CREATE OR REPLACE FUNCTION check_badge_eligibility(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total_xp INTEGER;
    badge_record RECORD;
BEGIN
    -- Get total XP for user
    SELECT COALESCE(SUM(xp_amount), 0) INTO total_xp
    FROM xp_events
    WHERE user_id = user_uuid;
    
    -- Check for badges that can be earned
    FOR badge_record IN 
        SELECT id, name, xp_required
        FROM badges
        WHERE xp_required <= total_xp
        AND is_active = true
        AND id NOT IN (
            SELECT badge_id FROM user_badges WHERE user_id = user_uuid
        )
    LOOP
        -- Award the badge
        INSERT INTO user_badges (user_id, badge_id)
        VALUES (user_uuid, badge_record.id)
        ON CONFLICT (user_id, badge_id) DO NOTHING;
        
        -- Award XP for badge
        INSERT INTO xp_events (user_id, event_type, xp_amount, description, reference_id, reference_type)
        VALUES (
            user_uuid,
            'badge_earned',
            50, -- 50 XP for earning a badge
            'Badge earned: ' || badge_record.name,
            badge_record.id,
            'badge'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to create ledger entry for donation
CREATE OR REPLACE FUNCTION create_donation_ledger_entry()
RETURNS TRIGGER AS $$
BEGIN
    -- Create ledger entry for donation
    INSERT INTO ledger_entries (
        transaction_id,
        user_id,
        organization_id,
        entry_type,
        amount_cents,
        currency,
        description,
        reference_id,
        reference_type
    ) VALUES (
        NEW.id,
        NEW.user_id,
        NEW.organization_id,
        'donation',
        NEW.amount_cents,
        NEW.currency,
        'Donation to ' || (SELECT name FROM organizations WHERE id = NEW.organization_id),
        NEW.id,
        'donation'
    );
    
    -- Award XP for donation
    INSERT INTO xp_events (user_id, event_type, xp_amount, description, reference_id, reference_type)
    VALUES (
        NEW.user_id,
        'donation',
        GREATEST(1, NEW.amount_cents / 100), -- 1 XP per dollar donated
        'Donation made: $' || (NEW.amount_cents / 100.0),
        NEW.id,
        'donation'
    );
    
    -- Check for badge eligibility
    PERFORM check_badge_eligibility(NEW.user_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for donation ledger entry
CREATE TRIGGER trigger_create_donation_ledger_entry
    AFTER INSERT ON donations
    FOR EACH ROW
    EXECUTE FUNCTION create_donation_ledger_entry();

-- Function to generate receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
    receipt_number TEXT;
    counter INTEGER;
BEGIN
    -- Generate receipt number with format: RCP-YYYYMMDD-XXXXXX
    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 13) AS INTEGER)), 0) + 1
    INTO counter
    FROM receipts
    WHERE receipt_number LIKE 'RCP-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-%';
    
    receipt_number := 'RCP-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 6, '0');
    
    RETURN receipt_number;
END;
$$ LANGUAGE plpgsql;

-- Function to create receipt for donation
CREATE OR REPLACE FUNCTION create_donation_receipt()
RETURNS TRIGGER AS $$
DECLARE
    receipt_num TEXT;
    org_name TEXT;
    org_address TEXT;
BEGIN
    -- Get organization details
    SELECT name, address INTO org_name, org_address
    FROM organizations
    WHERE id = NEW.organization_id;
    
    -- Generate receipt number
    receipt_num := generate_receipt_number();
    
    -- Create receipt
    INSERT INTO receipts (
        user_id,
        donation_id,
        receipt_number,
        amount_cents,
        currency,
        receipt_data
    ) VALUES (
        NEW.user_id,
        NEW.id,
        receipt_num,
        NEW.amount_cents,
        NEW.currency,
        jsonb_build_object(
            'donation_id', NEW.id,
            'organization_name', org_name,
            'organization_address', org_address,
            'amount', NEW.amount_cents / 100.0,
            'currency', NEW.currency,
            'date', NEW.created_at,
            'is_anonymous', NEW.is_anonymous,
            'message', NEW.message
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for receipt creation
CREATE TRIGGER trigger_create_donation_receipt
    AFTER INSERT ON donations
    FOR EACH ROW
    EXECUTE FUNCTION create_donation_receipt();

-- Function to add outbox event
CREATE OR REPLACE FUNCTION add_outbox_event(topic_name TEXT, payload_data JSONB)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO outbox (topic, payload)
    VALUES (topic_name, payload_data)
    RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process outbox events (called by pg-boss worker)
CREATE OR REPLACE FUNCTION process_outbox_events()
RETURNS TABLE(event_id UUID, topic_name TEXT, payload_data JSONB) AS $$
BEGIN
    RETURN QUERY
    UPDATE outbox
    SET 
        published_at = CURRENT_TIMESTAMP,
        retry_count = retry_count + 1,
        status = 'published'
    WHERE id IN (
        SELECT id FROM outbox
        WHERE status = 'pending'
        AND (retry_count < max_retries OR max_retries IS NULL)
        ORDER BY created_at
        LIMIT 100
    )
    RETURNING outbox.id, outbox.topic, outbox.payload;
END;
$$ LANGUAGE plpgsql;

-- Function to get user level based on XP
CREATE OR REPLACE FUNCTION get_user_level(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_xp INTEGER;
    user_level INTEGER;
BEGIN
    -- Get total XP for user
    SELECT COALESCE(SUM(xp_amount), 0) INTO total_xp
    FROM xp_events
    WHERE user_id = user_uuid;
    
    -- Calculate level (every 1000 XP = 1 level, starting at level 1)
    user_level := GREATEST(1, (total_xp / 1000) + 1);
    
    RETURN user_level;
END;
$$ LANGUAGE plpgsql;

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    total_xp INTEGER;
    total_hours DECIMAL(4,2);
    total_donations_cents INTEGER;
    badge_count INTEGER;
    user_level INTEGER;
BEGIN
    -- Get total XP
    SELECT COALESCE(SUM(xp_amount), 0) INTO total_xp
    FROM xp_events
    WHERE user_id = user_uuid;
    
    -- Get total volunteer hours
    SELECT COALESCE(SUM(hours_worked), 0) INTO total_hours
    FROM attendance
    WHERE user_id = user_uuid AND supervisor_verified = true;
    
    -- Get total donations
    SELECT COALESCE(SUM(amount_cents), 0) INTO total_donations_cents
    FROM donations
    WHERE user_id = user_uuid;
    
    -- Get badge count
    SELECT COUNT(*) INTO badge_count
    FROM user_badges
    WHERE user_id = user_uuid;
    
    -- Get user level
    user_level := get_user_level(user_uuid);
    
    RETURN jsonb_build_object(
        'total_xp', total_xp,
        'total_hours', total_hours,
        'total_donations', total_donations_cents / 100.0,
        'badge_count', badge_count,
        'level', user_level
    );
END;
$$ LANGUAGE plpgsql;
