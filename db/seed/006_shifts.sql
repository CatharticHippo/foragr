-- Seed data for shifts

INSERT INTO shifts (id, listing_id, title, description, start_time, end_time, max_volunteers, supervisor_name, supervisor_phone, supervisor_email, check_in_instructions) VALUES
-- Habitat for Humanity shifts
('a50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'Morning Build Session', 'Morning construction work on the new home project. Please arrive 15 minutes early for safety briefing.', '2024-02-15 08:00:00+00', '2024-02-15 12:00:00+00', 10, 'Sarah Wilson', '(555) 444-5555', 'sarah.wilson@habitat-sf.org', 'Check in at the main construction site. Look for the blue Habitat for Humanity tent.'),
('a50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440001', 'Afternoon Build Session', 'Afternoon construction work continuing the morning project. Lunch will be provided.', '2024-02-15 13:00:00+00', '2024-02-15 17:00:00+00', 10, 'Sarah Wilson', '(555) 444-5555', 'sarah.wilson@habitat-sf.org', 'Check in at the main construction site. Look for the blue Habitat for Humanity tent.'),

-- Food Bank shifts
('a50e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440002', 'Food Distribution Setup', 'Help set up the food distribution area and organize supplies for the day.', '2024-02-20 09:00:00+00', '2024-02-20 12:00:00+00', 8, 'David Brown', '(555) 555-6666', 'david.brown@foodbank.org', 'Check in at the main entrance of the community center. Ask for David Brown.'),
('a50e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440002', 'Food Distribution Service', 'Help distribute food to families and assist with registration.', '2024-02-20 12:00:00+00', '2024-02-20 15:00:00+00', 7, 'David Brown', '(555) 555-6666', 'david.brown@foodbank.org', 'Check in at the main entrance of the community center. Ask for David Brown.'),

-- Clean Water Initiative shifts
('a50e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440003', 'Well Site Preparation', 'Help prepare the site for well installation and organize equipment.', '2024-02-25 07:00:00+00', '2024-02-25 12:00:00+00', 6, 'Mike Chen', '(555) 777-8888', 'mike.chen@cleanwater.org', 'Meet at the project site. Look for the Clean Water Initiative banner.'),
('a50e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440003', 'Well Installation', 'Assist with the actual well installation process. Technical guidance provided.', '2024-02-25 13:00:00+00', '2024-02-25 18:00:00+00', 6, 'Mike Chen', '(555) 777-8888', 'mike.chen@cleanwater.org', 'Meet at the project site. Look for the Clean Water Initiative banner.');
