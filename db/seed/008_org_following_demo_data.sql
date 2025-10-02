-- Seed data for Organization Following & Cosmetics Demo
-- Creates 3 demo organizations with feed items and titles

-- Insert demo organizations with HQ coordinates and branding
INSERT INTO organizations (id, name, description, website, email, phone, address, city, state, zip_code, country, status, created_at, updated_at) VALUES
(
  uuid_generate_v4(),
  'Rocky Mountain Elk Foundation',
  'Dedicated to ensuring the future of elk, other wildlife, their habitat and our hunting heritage.',
  'https://www.rmef.org',
  'info@rmef.org',
  '+1-406-523-4500',
  '5705 Grant Creek Road',
  'Missoula',
  'MT',
  '59808',
  'USA',
  'approved',
  now(),
  now()
),
(
  uuid_generate_v4(),
  'Ecology Project International',
  'Connecting students to nature through hands-on field science and conservation programs.',
  'https://www.ecologyproject.org',
  'info@ecologyproject.org',
  '+1-406-721-8784',
  '315 South 4th Street East',
  'Missoula',
  'MT',
  '59801',
  'USA',
  'approved',
  now(),
  now()
),
(
  uuid_generate_v4(),
  'Foster Our Youth',
  'Supporting foster youth through mentorship, education, and life skills development.',
  'https://www.fosterouryouth.org',
  'info@fosterouryouth.org',
  '+1-323-555-0123',
  '1234 Sunset Boulevard',
  'Los Angeles',
  'CA',
  '90028',
  'USA',
  'approved',
  now(),
  now()
);

-- Get the org IDs for reference
DO $$
DECLARE
  rmef_id UUID;
  epi_id UUID;
  foy_id UUID;
BEGIN
  -- Get organization IDs
  SELECT id INTO rmef_id FROM organizations WHERE name = 'Rocky Mountain Elk Foundation';
  SELECT id INTO epi_id FROM organizations WHERE name = 'Ecology Project International';
  SELECT id INTO foy_id FROM organizations WHERE name = 'Foster Our Youth';

  -- Insert org titles for RMEF
  INSERT INTO org_titles (org_id, code, name, description, border_token, icon_token, rules, xp_reward) VALUES
  (rmef_id, 'conservation-steward', 'Conservation Steward', 'Completed 10+ hours of habitat restoration', 'border-green', 'icon-tree', '{"min_volunteer_hours": 10, "categories": ["environment", "conservation"]}', 100),
  (rmef_id, 'elk-advocate', 'Elk Advocate', 'Participated in 5+ elk conservation events', 'border-gold', 'icon-elk', '{"min_events": 5, "categories": ["wildlife", "conservation"]}', 150),
  (rmef_id, 'habitat-hero', 'Habitat Hero', 'Led a habitat restoration project', 'border-purple', 'icon-mountain', '{"leadership_role": true, "project_type": "habitat_restoration"}', 200);

  -- Insert org titles for EPI
  INSERT INTO org_titles (org_id, code, name, description, border_token, icon_token, rules, xp_reward) VALUES
  (epi_id, 'field-scientist', 'Field Scientist', 'Completed 20+ hours of field research', 'border-blue', 'icon-microscope', '{"min_volunteer_hours": 20, "categories": ["education", "research"]}', 120),
  (epi_id, 'youth-mentor', 'Youth Mentor', 'Mentored students in environmental education', 'border-teal', 'icon-graduation', '{"mentorship_hours": 15, "age_group": "youth"}', 180),
  (epi_id, 'conservation-educator', 'Conservation Educator', 'Led educational programs for 50+ students', 'border-emerald', 'icon-book', '{"students_taught": 50, "program_type": "education"}', 250);

  -- Insert org titles for FOY
  INSERT INTO org_titles (org_id, code, name, description, border_token, icon_token, rules, xp_reward) VALUES
  (foy_id, 'youth-champion', 'Youth Champion', 'Completed 25+ hours mentoring foster youth', 'border-orange', 'icon-heart', '{"min_volunteer_hours": 25, "categories": ["youth", "mentorship"]}', 150),
  (foy_id, 'life-skills-coach', 'Life Skills Coach', 'Taught life skills workshops', 'border-pink', 'icon-star', '{"workshops_led": 3, "skill_type": "life_skills"}', 200),
  (foy_id, 'foster-ally', 'Foster Ally', 'Completed comprehensive foster care training', 'border-indigo', 'icon-shield', '{"training_completed": true, "certification": "foster_care"}', 300);

  -- Insert feed items for RMEF (Missoula, MT area)
  INSERT INTO org_feed_items (org_id, kind, title, summary, description, location, starts_at, ends_at, url, image_url, data) VALUES
  (rmef_id, 'EVENT', 'Elk Habitat Restoration - Lolo National Forest', 'Join us for a day of habitat restoration in the Lolo National Forest', 'Help restore critical elk habitat by planting native vegetation and removing invasive species. Lunch provided.', ST_GeogFromText('POINT(-114.0199 46.8721)'), '2024-02-15 08:00:00+00', '2024-02-15 16:00:00+00', 'https://www.rmef.org/events/lolo-restoration', 'https://example.com/rmef-restoration.jpg', '{"volunteers_needed": 25, "difficulty": "moderate", "equipment_provided": true}'),
  (rmef_id, 'NEWS', 'Elk Population Reaches Record High in Montana', 'Conservation efforts show positive results across the state', 'Recent surveys indicate elk populations have reached their highest levels in decades, thanks to habitat restoration and conservation programs.', ST_GeogFromText('POINT(-114.0199 46.8721)'), null, null, 'https://www.rmef.org/news/elk-population-record', 'https://example.com/elk-herd.jpg', '{"category": "conservation", "impact": "positive"}'),
  (rmef_id, 'PROJECT', 'Missoula Valley Habitat Corridor', 'Creating wildlife corridors to connect fragmented habitats', 'Long-term project to establish wildlife corridors connecting the Missoula Valley with surrounding wilderness areas.', ST_GeogFromText('POINT(-114.0199 46.8721)'), null, null, 'https://www.rmef.org/projects/missoula-corridor', 'https://example.com/habitat-corridor.jpg', '{"duration": "3_years", "funding_goal": 500000, "progress": 35}'),
  (rmef_id, 'EVENT', 'Elk Bugling Workshop', 'Learn to identify and understand elk communication', 'Educational workshop on elk behavior and communication. Perfect for wildlife enthusiasts and hunters.', ST_GeogFromText('POINT(-114.0199 46.8721)'), '2024-03-10 18:00:00+00', '2024-03-10 20:00:00+00', 'https://www.rmef.org/events/bugling-workshop', 'https://example.com/elk-bugling.jpg', '{"max_participants": 30, "age_restriction": "12+"}');

  -- Insert feed items for EPI (Missoula, MT area)
  INSERT INTO org_feed_items (org_id, kind, title, summary, description, location, starts_at, ends_at, url, image_url, data) VALUES
  (epi_id, 'EVENT', 'Student Field Research - Bitterroot Valley', 'High school students conduct water quality research', 'Join high school students as they collect water samples and analyze data in the Bitterroot Valley.', ST_GeogFromText('POINT(-114.0199 46.8721)'), '2024-02-20 09:00:00+00', '2024-02-20 15:00:00+00', 'https://www.ecologyproject.org/events/bitterroot-research', 'https://example.com/water-research.jpg', '{"participants": "high_school", "research_type": "water_quality", "mentors_needed": 5}'),
  (epi_id, 'NEWS', 'EPI Students Publish Research on Climate Change', 'Student research contributes to climate science', 'High school students from our program have published their research on local climate change impacts in a peer-reviewed journal.', ST_GeogFromText('POINT(-114.0199 46.8721)'), null, null, 'https://www.ecologyproject.org/news/student-research-published', 'https://example.com/student-research.jpg', '{"category": "education", "achievement": "publication"}'),
  (epi_id, 'PROJECT', 'Montana Youth Climate Action Network', 'Building a network of young climate activists', 'Creating a statewide network of youth leaders working on climate action and environmental justice.', ST_GeogFromText('POINT(-114.0199 46.8721)'), null, null, 'https://www.ecologyproject.org/projects/youth-climate-network', 'https://example.com/youth-climate.jpg', '{"target_age": "14-18", "network_size": 150, "focus": "climate_action"}'),
  (epi_id, 'EVENT', 'Environmental Education Training', 'Training for new environmental educators', 'Comprehensive training program for volunteers interested in teaching environmental science to students.', ST_GeogFromText('POINT(-114.0199 46.8721)'), '2024-03-05 10:00:00+00', '2024-03-05 17:00:00+00', 'https://www.ecologyproject.org/events/educator-training', 'https://example.com/educator-training.jpg', '{"certification": true, "materials_included": true}');

  -- Insert feed items for FOY (Los Angeles, CA area)
  INSERT INTO org_feed_items (org_id, kind, title, summary, description, location, starts_at, ends_at, url, image_url, data) VALUES
  (foy_id, 'EVENT', 'Life Skills Workshop - Financial Literacy', 'Teaching foster youth essential money management skills', 'Interactive workshop covering budgeting, saving, and financial planning for youth transitioning out of foster care.', ST_GeogFromText('POINT(-118.2437 34.0522)'), '2024-02-25 14:00:00+00', '2024-02-25 17:00:00+00', 'https://www.fosterouryouth.org/events/financial-literacy', 'https://example.com/financial-workshop.jpg', '{"age_group": "16-21", "topics": ["budgeting", "saving", "credit"], "materials_provided": true}'),
  (foy_id, 'NEWS', 'FOY Mentorship Program Expands to Orange County', 'Program now serving youth in additional counties', 'Our successful mentorship program is expanding to serve foster youth in Orange County, doubling our reach.', ST_GeogFromText('POINT(-118.2437 34.0522)'), null, null, 'https://www.fosterouryouth.org/news/orange-county-expansion', 'https://example.com/mentorship-expansion.jpg', '{"category": "expansion", "new_counties": ["orange"], "impact": "doubled_reach"}'),
  (foy_id, 'PROJECT', 'College Readiness Initiative', 'Supporting foster youth through college preparation', 'Comprehensive program providing academic support, college application assistance, and scholarship opportunities.', ST_GeogFromText('POINT(-118.2437 34.0522)'), null, null, 'https://www.fosterouryouth.org/projects/college-readiness', 'https://example.com/college-readiness.jpg', '{"duration": "ongoing", "students_served": 200, "success_rate": 85}'),
  (foy_id, 'EVENT', 'Mentor Training Session', 'Training for new volunteer mentors', 'Essential training for volunteers interested in mentoring foster youth. Covers trauma-informed care and effective mentoring strategies.', ST_GeogFromText('POINT(-118.2437 34.0522)'), '2024-03-15 09:00:00+00', '2024-03-15 16:00:00+00', 'https://www.fosterouryouth.org/events/mentor-training', 'https://example.com/mentor-training.jpg', '{"certification": true, "background_check": true, "ongoing_support": true}');

END $$;

-- Add some sample user follows (assuming we have demo users)
-- This would typically be done through the application, but for demo purposes:
DO $$
DECLARE
  demo_user_id UUID;
  rmef_id UUID;
  epi_id UUID;
  foy_id UUID;
BEGIN
  -- Get a demo user (assuming one exists)
  SELECT id INTO demo_user_id FROM users LIMIT 1;
  
  -- Get organization IDs
  SELECT id INTO rmef_id FROM organizations WHERE name = 'Rocky Mountain Elk Foundation';
  SELECT id INTO epi_id FROM organizations WHERE name = 'Ecology Project International';
  SELECT id INTO foy_id FROM organizations WHERE name = 'Foster Our Youth';

  -- Only insert if we have a demo user
  IF demo_user_id IS NOT NULL THEN
    -- Demo user follows all three organizations
    INSERT INTO organization_follows (user_id, org_id) VALUES
    (demo_user_id, rmef_id),
    (demo_user_id, epi_id),
    (demo_user_id, foy_id)
    ON CONFLICT (user_id, org_id) DO NOTHING;
  END IF;
END $$;
