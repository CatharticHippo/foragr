-- Seed data for organizations

INSERT INTO organizations (id, name, description, ein, website_url, logo_url, location, address, city, state, zip_code, country, phone, email, status, stripe_account_id, stripe_account_verified) VALUES
-- Approved organizations
('650e8400-e29b-41d4-a716-446655440001', 'Habitat for Humanity', 'Building homes, communities, and hope through affordable housing solutions.', '52-1234567', 'https://www.habitat.org', '/logos/habitat-for-humanity.png', ST_Point(-122.4194, 37.7749), '123 Main St', 'San Francisco', 'CA', '94102', 'US', '(555) 123-4567', 'info@habitat-sf.org', 'approved', 'acct_1234567890', true),
('650e8400-e29b-41d4-a716-446655440002', 'Food Bank of America', 'Fighting hunger and feeding hope in communities across America.', '12-3456789', 'https://www.foodbank.org', '/logos/food-bank-america.png', ST_Point(-74.0060, 40.7128), '456 Broadway', 'New York', 'NY', '10013', 'US', '(555) 234-5678', 'contact@foodbank.org', 'approved', 'acct_2345678901', true),
('650e8400-e29b-41d4-a716-446655440003', 'Clean Water Initiative', 'Providing access to clean water and sanitation in underserved communities.', '98-7654321', 'https://www.cleanwater.org', '/logos/clean-water-initiative.png', ST_Point(-87.6298, 41.8781), '789 Michigan Ave', 'Chicago', 'IL', '60611', 'US', '(555) 345-6789', 'info@cleanwater.org', 'approved', 'acct_3456789012', true),

-- Pending organizations
('650e8400-e29b-41d4-a716-446655440004', 'Animal Rescue League', 'Saving and caring for abandoned and abused animals.', '45-6789012', 'https://www.animalrescue.org', '/logos/animal-rescue-league.png', ST_Point(-118.2437, 34.0522), '321 Sunset Blvd', 'Los Angeles', 'CA', '90028', 'US', '(555) 456-7890', 'info@animalrescue.org', 'pending', NULL, false),
('650e8400-e29b-41d4-a716-446655440005', 'Youth Education Foundation', 'Empowering youth through education and mentorship programs.', '67-8901234', 'https://www.youtheducation.org', '/logos/youth-education-foundation.png', ST_Point(-96.7970, 32.7767), '654 Elm St', 'Dallas', 'TX', '75201', 'US', '(555) 567-8901', 'contact@youtheducation.org', 'pending', NULL, false);
