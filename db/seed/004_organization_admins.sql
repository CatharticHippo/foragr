-- Seed data for organization admins

INSERT INTO organization_admins (id, organization_id, user_id, role, is_primary) VALUES
-- Habitat for Humanity admins
('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', 'admin', true),

-- Food Bank of America admins
('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005', 'admin', true);
