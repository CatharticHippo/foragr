-- Performance indexes for the marketplace

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users USING GIST(location);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = true;

-- Organizations indexes
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_location ON organizations USING GIST(location);
CREATE INDEX idx_organizations_ein ON organizations(ein) WHERE ein IS NOT NULL;
CREATE INDEX idx_organizations_stripe_account_id ON organizations(stripe_account_id) WHERE stripe_account_id IS NOT NULL;

-- Organization admins indexes
CREATE INDEX idx_organization_admins_org_id ON organization_admins(organization_id);
CREATE INDEX idx_organization_admins_user_id ON organization_admins(user_id);
CREATE INDEX idx_organization_admins_primary ON organization_admins(organization_id, is_primary) WHERE is_primary = true;

-- Listings indexes
CREATE INDEX idx_listings_org_id ON listings(organization_id);
CREATE INDEX idx_listings_type ON listings(listing_type);
CREATE INDEX idx_listings_location ON listings USING GIST(location);
CREATE INDEX idx_listings_start_date ON listings(start_date);
CREATE INDEX idx_listings_end_date ON listings(end_date);
CREATE INDEX idx_listings_is_active ON listings(is_active) WHERE is_active = true;
CREATE INDEX idx_listings_is_featured ON listings(is_featured) WHERE is_featured = true;
CREATE INDEX idx_listings_tags ON listings USING GIN(tags);
CREATE INDEX idx_listings_required_skills ON listings USING GIN(required_skills);

-- Full-text search index for listings
CREATE INDEX idx_listings_fts ON listings USING GIN(to_tsvector('english', title || ' ' || description));

-- Shifts indexes
CREATE INDEX idx_shifts_listing_id ON shifts(listing_id);
CREATE INDEX idx_shifts_start_time ON shifts(start_time);
CREATE INDEX idx_shifts_end_time ON shifts(end_time);
CREATE INDEX idx_shifts_time_range ON shifts(start_time, end_time);

-- Applications indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_listing_id ON applications(listing_id);
CREATE INDEX idx_applications_shift_id ON applications(shift_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);
CREATE INDEX idx_applications_reviewed_at ON applications(reviewed_at);

-- Attendance indexes
CREATE INDEX idx_attendance_application_id ON attendance(application_id);
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_shift_id ON attendance(shift_id);
CREATE INDEX idx_attendance_check_in_time ON attendance(check_in_time);
CREATE INDEX idx_attendance_check_out_time ON attendance(check_out_time);
CREATE INDEX idx_attendance_check_in_location ON attendance USING GIST(check_in_location);
CREATE INDEX idx_attendance_check_out_location ON attendance USING GIST(check_out_location);
CREATE INDEX idx_attendance_supervisor_verified ON attendance(supervisor_verified) WHERE supervisor_verified = true;

-- Donations indexes
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_org_id ON donations(organization_id);
CREATE INDEX idx_donations_listing_id ON donations(listing_id);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_donations_stripe_payment_intent_id ON donations(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX idx_donations_stripe_charge_id ON donations(stripe_charge_id) WHERE stripe_charge_id IS NOT NULL;

-- In-kind items indexes
CREATE INDEX idx_in_kind_items_user_id ON in_kind_items(user_id);
CREATE INDEX idx_in_kind_items_org_id ON in_kind_items(organization_id);
CREATE INDEX idx_in_kind_items_listing_id ON in_kind_items(listing_id);
CREATE INDEX idx_in_kind_items_created_at ON in_kind_items(created_at);

-- XP events indexes
CREATE INDEX idx_xp_events_user_id ON xp_events(user_id);
CREATE INDEX idx_xp_events_event_type ON xp_events(event_type);
CREATE INDEX idx_xp_events_created_at ON xp_events(created_at);
CREATE INDEX idx_xp_events_reference ON xp_events(reference_id, reference_type);

-- Badges indexes
CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_xp_required ON badges(xp_required);
CREATE INDEX idx_badges_is_active ON badges(is_active) WHERE is_active = true;

-- User badges indexes
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_badges_earned_at ON user_badges(earned_at);

-- Ledger entries indexes
CREATE INDEX idx_ledger_entries_transaction_id ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_user_id ON ledger_entries(user_id);
CREATE INDEX idx_ledger_entries_org_id ON ledger_entries(organization_id);
CREATE INDEX idx_ledger_entries_entry_type ON ledger_entries(entry_type);
CREATE INDEX idx_ledger_entries_created_at ON ledger_entries(created_at);
CREATE INDEX idx_ledger_entries_reference ON ledger_entries(reference_id, reference_type);

-- Receipts indexes
CREATE INDEX idx_receipts_user_id ON receipts(user_id);
CREATE INDEX idx_receipts_donation_id ON receipts(donation_id);
CREATE INDEX idx_receipts_in_kind_item_id ON receipts(in_kind_item_id);
CREATE INDEX idx_receipts_receipt_number ON receipts(receipt_number);
CREATE INDEX idx_receipts_created_at ON receipts(created_at);

-- Outbox indexes
CREATE INDEX idx_outbox_topic ON outbox(topic);
CREATE INDEX idx_outbox_status ON outbox(status);
CREATE INDEX idx_outbox_created_at ON outbox(created_at);
CREATE INDEX idx_outbox_published_at ON outbox(published_at);
CREATE INDEX idx_outbox_retry_count ON outbox(retry_count);

-- Composite indexes for common queries
CREATE INDEX idx_listings_org_active ON listings(organization_id, is_active) WHERE is_active = true;
CREATE INDEX idx_applications_user_status ON applications(user_id, status);
CREATE INDEX idx_applications_listing_status ON applications(listing_id, status);
CREATE INDEX idx_donations_user_created ON donations(user_id, created_at);
CREATE INDEX idx_donations_org_created ON donations(organization_id, created_at);
CREATE INDEX idx_xp_events_user_created ON xp_events(user_id, created_at);
