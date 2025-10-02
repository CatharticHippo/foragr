-- Sample applications, donations, and other data

-- Sample applications
INSERT INTO applications (id, user_id, listing_id, shift_id, status, application_text, skills, availability, emergency_contact_name, emergency_contact_phone, applied_at) VALUES
('b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'accepted', 'I have construction experience and am passionate about affordable housing.', ARRAY['construction', 'teamwork'], 'Available weekends', 'Mary Doe', '(555) 111-0000', '2024-01-15 10:00:00+00'),
('b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440003', 'accepted', 'I love helping people and have experience in customer service.', ARRAY['customer service', 'organization'], 'Available weekdays', 'Bob Smith', '(555) 222-0000', '2024-01-16 14:00:00+00');

-- Sample donations
INSERT INTO donations (id, user_id, organization_id, listing_id, amount_cents, currency, donation_method, stripe_payment_intent_id, stripe_charge_id, is_anonymous, message, created_at) VALUES
('c50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440004', 5000, 'USD', 'stripe', 'pi_1234567890', 'ch_1234567890', false, 'Happy to support affordable housing!', '2024-01-20 15:30:00+00'),
('c50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440005', 2500, 'USD', 'stripe', 'pi_2345678901', 'ch_2345678901', false, 'Keep up the great work fighting hunger!', '2024-01-21 09:15:00+00');

-- Sample attendance (completed volunteer work)
INSERT INTO attendance (id, application_id, user_id, shift_id, check_in_time, check_out_time, check_in_location, check_out_location, supervisor_verified, supervisor_id, hours_worked, notes) VALUES
('d50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', '2024-02-15 07:45:00+00', '2024-02-15 12:15:00+00', ST_Point(-122.4194, 37.7749), ST_Point(-122.4194, 37.7749), true, '750e8400-e29b-41d4-a716-446655440004', 4.5, 'Great work on the framing!'),
('d50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440003', '2024-02-20 08:45:00+00', '2024-02-20 12:15:00+00', ST_Point(-74.0060, 40.7128), ST_Point(-74.0060, 40.7128), true, '750e8400-e29b-41d4-a716-446655440005', 3.5, 'Excellent customer service skills!');
