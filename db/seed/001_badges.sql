-- Seed data for badges

INSERT INTO badges (id, name, description, icon_url, xp_required, category, is_active) VALUES
-- Volunteer badges
('550e8400-e29b-41d4-a716-446655440001', 'First Steps', 'Complete your first volunteer shift', '/icons/badges/first-steps.png', 0, 'volunteer', true),
('550e8400-e29b-41d4-a716-446655440002', 'Volunteer Novice', 'Complete 5 volunteer hours', '/icons/badges/volunteer-novice.png', 500, 'volunteer', true),
('550e8400-e29b-41d4-a716-446655440003', 'Volunteer Apprentice', 'Complete 25 volunteer hours', '/icons/badges/volunteer-apprentice.png', 2500, 'volunteer', true),
('550e8400-e29b-41d4-a716-446655440004', 'Volunteer Expert', 'Complete 100 volunteer hours', '/icons/badges/volunteer-expert.png', 10000, 'volunteer', true),
('550e8400-e29b-41d4-a716-446655440005', 'Volunteer Master', 'Complete 500 volunteer hours', '/icons/badges/volunteer-master.png', 50000, 'volunteer', true),

-- Donation badges
('550e8400-e29b-41d4-a716-446655440006', 'First Donation', 'Make your first donation', '/icons/badges/first-donation.png', 0, 'donation', true),
('550e8400-e29b-41d4-a716-446655440007', 'Generous Heart', 'Donate $100 total', '/icons/badges/generous-heart.png', 100, 'donation', true),
('550e8400-e29b-41d4-a716-446655440008', 'Philanthropist', 'Donate $500 total', '/icons/badges/philanthropist.png', 500, 'donation', true),
('550e8400-e29b-41d4-a716-446655440009', 'Community Champion', 'Donate $1000 total', '/icons/badges/community-champion.png', 1000, 'donation', true),
('550e8400-e29b-41d4-a716-446655440010', 'Impact Leader', 'Donate $5000 total', '/icons/badges/impact-leader.png', 5000, 'donation', true),

-- Milestone badges
('550e8400-e29b-41d4-a716-446655440011', 'Level 5', 'Reach level 5', '/icons/badges/level-5.png', 5000, 'milestone', true),
('550e8400-e29b-41d4-a716-446655440012', 'Level 10', 'Reach level 10', '/icons/badges/level-10.png', 10000, 'milestone', true),
('550e8400-e29b-41d4-a716-446655440013', 'Level 25', 'Reach level 25', '/icons/badges/level-25.png', 25000, 'milestone', true),
('550e8400-e29b-41d4-a716-446655440014', 'Level 50', 'Reach level 50', '/icons/badges/level-50.png', 50000, 'milestone', true),

-- Special badges
('550e8400-e29b-41d4-a716-446655440015', 'Early Adopter', 'Join the platform in the first month', '/icons/badges/early-adopter.png', 0, 'special', true),
('550e8400-e29b-41d4-a716-446655440016', 'Community Builder', 'Help 10 different organizations', '/icons/badges/community-builder.png', 0, 'special', true),
('550e8400-e29b-41d4-a716-446655440017', 'Consistency Champion', 'Volunteer for 6 consecutive months', '/icons/badges/consistency-champion.png', 0, 'special', true),
('550e8400-e29b-41d4-a716-446655440018', 'Social Butterfly', 'Share 10 activities on social media', '/icons/badges/social-butterfly.png', 0, 'special', true);
