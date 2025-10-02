# [EPIC B] Database & RLS — [TICKET] Base Schema & Extensions

## Summary
Create the core database schema with all required tables, enums, indexes, and PostgreSQL extensions for the marketplace platform.

## Acceptance Criteria
- [ ] Enable required extensions: postgis, pg_trgm, pgcrypto, uuid-ossp
- [ ] Create all core tables: users, organizations, organization_admins, listings, shifts, applications, attendance, donations, in_kind_items, xp_events, badges, user_badges, ledger_entries, receipts
- [ ] Define enums: listing_type, donation_method, app_status
- [ ] Create proper indexes: GIST for geospatial, GIN for FTS/arrays, composite for hot paths
- [ ] Set up outbox table for event sourcing
- [ ] Configure proper data types and constraints

## Definition of Done
- All migrations run successfully
- Database schema matches requirements
- Indexes are properly created and optimized
- Extensions are enabled and functional
- Schema is documented with comments
- Migration rollback scripts work

## Tech Notes
- Use UUIDs for all primary keys
- Implement proper foreign key constraints
- Use PostGIS geometry types for location data
- Set up proper indexes for performance
- Include audit fields (created_at, updated_at)
- Use appropriate data types for each field
- Consider partitioning for high-volume tables
