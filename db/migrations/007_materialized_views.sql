-- Materialized views for feeds and leaderboards

-- User feed materialized view
CREATE MATERIALIZED VIEW user_feed AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.profile_image_url,
    l.id as listing_id,
    l.title as listing_title,
    l.description as listing_description,
    l.listing_type,
    l.start_date,
    l.end_date,
    o.name as organization_name,
    o.logo_url as organization_logo,
    'listing' as feed_type,
    l.created_at as event_date
FROM users u
CROSS JOIN listings l
JOIN organizations o ON l.organization_id = o.id
WHERE l.is_active = true 
AND o.status = 'approved'
AND l.start_date > CURRENT_TIMESTAMP
ORDER BY l.created_at DESC;

-- Create index on materialized view
CREATE INDEX idx_user_feed_user_id ON user_feed(user_id);
CREATE INDEX idx_user_feed_event_date ON user_feed(event_date);
CREATE INDEX idx_user_feed_listing_type ON user_feed(listing_type);

-- Leaderboard materialized view
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.profile_image_url,
    COALESCE(SUM(xe.xp_amount), 0) as total_xp,
    COALESCE(SUM(a.hours_worked), 0) as total_hours,
    COALESCE(SUM(d.amount_cents), 0) as total_donations_cents,
    COUNT(DISTINCT ub.badge_id) as badge_count,
    get_user_level(u.id) as level,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(xe.xp_amount), 0) DESC) as rank
FROM users u
LEFT JOIN xp_events xe ON u.id = xe.user_id
LEFT JOIN attendance a ON u.id = a.user_id AND a.supervisor_verified = true
LEFT JOIN donations d ON u.id = d.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
WHERE u.is_active = true
GROUP BY u.id, u.first_name, u.last_name, u.profile_image_url
ORDER BY total_xp DESC;

-- Create index on leaderboard
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);
CREATE INDEX idx_leaderboard_total_xp ON leaderboard(total_xp);
CREATE INDEX idx_leaderboard_user_id ON leaderboard(user_id);

-- Organization stats materialized view
CREATE MATERIALIZED VIEW organization_stats AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    o.logo_url,
    COUNT(DISTINCT l.id) as total_listings,
    COUNT(DISTINCT CASE WHEN l.is_active = true THEN l.id END) as active_listings,
    COUNT(DISTINCT a.id) as total_applications,
    COUNT(DISTINCT CASE WHEN a.status = 'accepted' THEN a.id END) as accepted_applications,
    COUNT(DISTINCT d.id) as total_donations,
    COALESCE(SUM(d.amount_cents), 0) as total_donations_cents,
    COUNT(DISTINCT att.id) as total_attendance_records,
    COALESCE(SUM(att.hours_worked), 0) as total_volunteer_hours
FROM organizations o
LEFT JOIN listings l ON o.id = l.organization_id
LEFT JOIN applications a ON l.id = a.listing_id
LEFT JOIN donations d ON o.id = d.organization_id
LEFT JOIN attendance att ON a.id = att.application_id AND att.supervisor_verified = true
WHERE o.status = 'approved'
GROUP BY o.id, o.name, o.logo_url
ORDER BY total_donations_cents DESC;

-- Create index on organization stats
CREATE INDEX idx_organization_stats_org_id ON organization_stats(organization_id);
CREATE INDEX idx_organization_stats_total_donations ON organization_stats(total_donations_cents);

-- Recent activity materialized view
CREATE MATERIALIZED VIEW recent_activity AS
SELECT 
    'donation' as activity_type,
    d.id as activity_id,
    d.user_id,
    u.first_name,
    u.last_name,
    u.profile_image_url,
    o.name as organization_name,
    o.logo_url as organization_logo,
    d.amount_cents,
    d.currency,
    d.created_at as activity_date,
    d.is_anonymous
FROM donations d
JOIN users u ON d.user_id = u.id
JOIN organizations o ON d.organization_id = o.id
WHERE d.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'

UNION ALL

SELECT 
    'volunteer' as activity_type,
    att.id as activity_id,
    att.user_id,
    u.first_name,
    u.last_name,
    u.profile_image_url,
    o.name as organization_name,
    o.logo_url as organization_logo,
    NULL as amount_cents,
    NULL as currency,
    att.check_out_time as activity_date,
    false as is_anonymous
FROM attendance att
JOIN users u ON att.user_id = u.id
JOIN shifts s ON att.shift_id = s.id
JOIN listings l ON s.listing_id = l.id
JOIN organizations o ON l.organization_id = o.id
WHERE att.check_out_time > CURRENT_TIMESTAMP - INTERVAL '30 days'
AND att.supervisor_verified = true

ORDER BY activity_date DESC;

-- Create index on recent activity
CREATE INDEX idx_recent_activity_activity_date ON recent_activity(activity_date);
CREATE INDEX idx_recent_activity_activity_type ON recent_activity(activity_type);
CREATE INDEX idx_recent_activity_user_id ON recent_activity(user_id);

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_feed;
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
    REFRESH MATERIALIZED VIEW CONCURRENTLY organization_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY recent_activity;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh materialized views from outbox events
CREATE OR REPLACE FUNCTION refresh_views_from_outbox()
RETURNS TRIGGER AS $$
BEGIN
    -- Only refresh if the event affects materialized views
    IF NEW.topic IN ('donation.created', 'attendance.verified', 'user.updated', 'listing.created', 'listing.updated') THEN
        -- Use pg_cron or a background job to refresh views
        -- For now, we'll just log that a refresh is needed
        PERFORM add_outbox_event('materialized_view.refresh_needed', jsonb_build_object(
            'triggered_by', NEW.topic,
            'triggered_at', CURRENT_TIMESTAMP
        ));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh views when relevant data changes
CREATE TRIGGER trigger_refresh_views_from_outbox
    AFTER INSERT ON outbox
    FOR EACH ROW
    EXECUTE FUNCTION refresh_views_from_outbox();

-- Function to get user feed with pagination
CREATE OR REPLACE FUNCTION get_user_feed(
    user_uuid UUID,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    listing_id UUID,
    listing_title VARCHAR(255),
    listing_description TEXT,
    listing_type listing_type,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    organization_name VARCHAR(255),
    organization_logo TEXT,
    feed_type TEXT,
    event_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        uf.listing_id,
        uf.listing_title,
        uf.listing_description,
        uf.listing_type,
        uf.start_date,
        uf.end_date,
        uf.organization_name,
        uf.organization_logo,
        uf.feed_type,
        uf.event_date
    FROM user_feed uf
    WHERE uf.user_id = user_uuid
    ORDER BY uf.event_date DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get leaderboard with pagination
CREATE OR REPLACE FUNCTION get_leaderboard(
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    user_id UUID,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url TEXT,
    total_xp BIGINT,
    total_hours NUMERIC,
    total_donations_cents BIGINT,
    badge_count BIGINT,
    level INTEGER,
    rank BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lb.user_id,
        lb.first_name,
        lb.last_name,
        lb.profile_image_url,
        lb.total_xp,
        lb.total_hours,
        lb.total_donations_cents,
        lb.badge_count,
        lb.level,
        lb.rank
    FROM leaderboard lb
    ORDER BY lb.rank
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
