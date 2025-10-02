-- Seed data for users

INSERT INTO users (id, email, password_hash, first_name, last_name, phone, date_of_birth, profile_image_url, bio, location, address, city, state, zip_code, country, is_verified, is_active, role) VALUES
-- Regular users
('750e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '$2b$10$rQZ8K9vX7wE2tY3uI4oP5e', 'John', 'Doe', '(555) 111-2222', '1990-05-15', '/profiles/john-doe.jpg', 'Passionate about community service and making a difference.', ST_Point(-122.4194, 37.7749), '100 Market St', 'San Francisco', 'CA', '94105', 'US', true, true, 'user'),
('750e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', '$2b$10$rQZ8K9vX7wE2tY3uI4oP5e', 'Jane', 'Smith', '(555) 222-3333', '1985-08-22', '/profiles/jane-smith.jpg', 'Environmental activist and volunteer coordinator.', ST_Point(-74.0060, 40.7128), '200 Broadway', 'New York', 'NY', '10013', 'US', true, true, 'user'),
('750e8400-e29b-41d4-a716-446655440003', 'mike.johnson@example.com', '$2b$10$rQZ8K9vX7wE2tY3uI4oP5e', 'Mike', 'Johnson', '(555) 333-4444', '1992-12-10', '/profiles/mike-johnson.jpg', 'Tech professional who loves giving back to the community.', ST_Point(-87.6298, 41.8781), '300 Michigan Ave', 'Chicago', 'IL', '60611', 'US', true, true, 'user'),

-- Organization admins
('750e8400-e29b-41d4-a716-446655440004', 'admin@habitat-sf.org', '$2b$10$rQZ8K9vX7wE2tY3uI4oP5e', 'Sarah', 'Wilson', '(555) 444-5555', '1980-03-18', '/profiles/sarah-wilson.jpg', 'Executive Director at Habitat for Humanity SF.', ST_Point(-122.4194, 37.7749), '123 Main St', 'San Francisco', 'CA', '94102', 'US', true, true, 'org_admin'),
('750e8400-e29b-41d4-a716-446655440005', 'admin@foodbank.org', '$2b$10$rQZ8K9vX7wE2tY3uI4oP5e', 'David', 'Brown', '(555) 555-6666', '1975-11-25', '/profiles/david-brown.jpg', 'Operations Manager at Food Bank of America.', ST_Point(-74.0060, 40.7128), '456 Broadway', 'New York', 'NY', '10013', 'US', true, true, 'org_admin'),

-- Super admin
('750e8400-e29b-41d4-a716-446655440006', 'admin@cedarlume.org', '$2b$10$rQZ8K9vX7wE2tY3uI4oP5e', 'Admin', 'User', '(555) 666-7777', '1988-07-14', '/profiles/admin-user.jpg', 'Platform administrator for Cedarlume marketplace.', ST_Point(-122.4194, 37.7749), '500 Market St', 'San Francisco', 'CA', '94105', 'US', true, true, 'super_admin');
