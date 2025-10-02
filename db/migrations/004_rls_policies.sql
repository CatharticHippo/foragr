-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE in_kind_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = current_setting('app.user_id')::uuid);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = current_setting('app.user_id')::uuid);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (id = current_setting('app.user_id')::uuid);

-- Organizations policies
CREATE POLICY "Anyone can view approved organizations" ON organizations
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Organization admins can view their organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

CREATE POLICY "Organization admins can update their organization" ON organizations
    FOR UPDATE USING (
        id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

CREATE POLICY "Super admins can view all organizations" ON organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_setting('app.user_id')::uuid 
            AND role = 'super_admin'
        )
    );

CREATE POLICY "Super admins can update all organizations" ON organizations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_setting('app.user_id')::uuid 
            AND role = 'super_admin'
        )
    );

-- Organization admins policies
CREATE POLICY "Organization admins can view their organization's admins" ON organization_admins
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

CREATE POLICY "Organization admins can manage their organization's admins" ON organization_admins
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

CREATE POLICY "Users can view their own admin roles" ON organization_admins
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

-- Listings policies
CREATE POLICY "Anyone can view active listings from approved organizations" ON listings
    FOR SELECT USING (
        is_active = true AND 
        organization_id IN (
            SELECT id FROM organizations WHERE status = 'approved'
        )
    );

CREATE POLICY "Organization admins can view their organization's listings" ON listings
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

CREATE POLICY "Organization admins can manage their organization's listings" ON listings
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

-- Shifts policies
CREATE POLICY "Anyone can view shifts for active listings" ON shifts
    FOR SELECT USING (
        listing_id IN (
            SELECT id FROM listings 
            WHERE is_active = true AND 
            organization_id IN (
                SELECT id FROM organizations WHERE status = 'approved'
            )
        )
    );

CREATE POLICY "Organization admins can manage shifts for their listings" ON shifts
    FOR ALL USING (
        listing_id IN (
            SELECT id FROM listings 
            WHERE organization_id IN (
                SELECT organization_id FROM organization_admins 
                WHERE user_id = current_setting('app.user_id')::uuid
            )
        )
    );

-- Applications policies
CREATE POLICY "Users can view their own applications" ON applications
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Users can create their own applications" ON applications
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Users can update their own applications" ON applications
    FOR UPDATE USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Organization admins can view applications for their listings" ON applications
    FOR SELECT USING (
        listing_id IN (
            SELECT id FROM listings 
            WHERE organization_id IN (
                SELECT organization_id FROM organization_admins 
                WHERE user_id = current_setting('app.user_id')::uuid
            )
        )
    );

CREATE POLICY "Organization admins can update applications for their listings" ON applications
    FOR UPDATE USING (
        listing_id IN (
            SELECT id FROM listings 
            WHERE organization_id IN (
                SELECT organization_id FROM organization_admins 
                WHERE user_id = current_setting('app.user_id')::uuid
            )
        )
    );

-- Attendance policies
CREATE POLICY "Users can view their own attendance" ON attendance
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Organization admins can view attendance for their shifts" ON attendance
    FOR SELECT USING (
        shift_id IN (
            SELECT s.id FROM shifts s
            JOIN listings l ON s.listing_id = l.id
            WHERE l.organization_id IN (
                SELECT organization_id FROM organization_admins 
                WHERE user_id = current_setting('app.user_id')::uuid
            )
        )
    );

CREATE POLICY "Organization admins can manage attendance for their shifts" ON attendance
    FOR ALL USING (
        shift_id IN (
            SELECT s.id FROM shifts s
            JOIN listings l ON s.listing_id = l.id
            WHERE l.organization_id IN (
                SELECT organization_id FROM organization_admins 
                WHERE user_id = current_setting('app.user_id')::uuid
            )
        )
    );

-- Donations policies
CREATE POLICY "Users can view their own donations" ON donations
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Users can create their own donations" ON donations
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Organization admins can view donations to their organization" ON donations
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

-- In-kind items policies
CREATE POLICY "Users can view their own in-kind items" ON in_kind_items
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Users can create their own in-kind items" ON in_kind_items
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Users can update their own in-kind items" ON in_kind_items
    FOR UPDATE USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Organization admins can view in-kind items for their organization" ON in_kind_items
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

-- XP events policies
CREATE POLICY "Users can view their own XP events" ON xp_events
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

-- Badges policies
CREATE POLICY "Anyone can view active badges" ON badges
    FOR SELECT USING (is_active = true);

-- User badges policies
CREATE POLICY "Users can view their own badges" ON user_badges
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Anyone can view public user badges" ON user_badges
    FOR SELECT USING (true); -- Badges are public by default

-- Ledger entries policies
CREATE POLICY "Users can view their own ledger entries" ON ledger_entries
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

CREATE POLICY "Organization admins can view their organization's ledger entries" ON ledger_entries
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM organization_admins 
            WHERE user_id = current_setting('app.user_id')::uuid
        )
    );

-- Receipts policies
CREATE POLICY "Users can view their own receipts" ON receipts
    FOR SELECT USING (user_id = current_setting('app.user_id')::uuid);

-- Outbox policies (system only)
CREATE POLICY "System can manage outbox" ON outbox
    FOR ALL USING (false); -- Only system processes should access outbox

-- Helper function to set user context
CREATE OR REPLACE FUNCTION set_user_context(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.user_id', user_uuid::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
