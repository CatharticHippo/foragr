# F-1: DDL & RLS for Organization Following & Cosmetics

## Epic
**F: Org Following & Cosmetics**

## Description
Create database schema and Row Level Security (RLS) policies for organization following, titles, and feed items functionality.

## Acceptance Criteria
- [ ] Create `organization_follows` table with composite primary key
- [ ] Create `org_titles` table with JSONB rules for earning conditions
- [ ] Create `user_org_titles` table for tracking earned titles
- [ ] Create `org_feed_items` table with PostGIS geography support
- [ ] Implement RLS policies for all tables
- [ ] Add proper indexes for performance
- [ ] Add database comments for documentation

## Technical Details

### Tables Created
1. **organization_follows**
   - Composite PK: (user_id, org_id)
   - References users and organizations with CASCADE delete
   - Tracks when user started following

2. **org_titles**
   - Unique constraint on (org_id, code)
   - JSONB rules field for declarative earning conditions
   - XP reward tracking

3. **user_org_titles**
   - Composite PK: (user_id, org_id, title_id)
   - Tracks when titles were awarded

4. **org_feed_items**
   - PostGIS geography column for location
   - Enum for item kinds (EVENT, NEWS, PROJECT)
   - Published flag for content management

### RLS Policies
- Users can only manage their own follows
- Public read access for approved organizations
- Org admins can manage their organization's content
- System can insert user titles (for award process)

## Definition of Done
- [ ] Migration file created and tested
- [ ] RLS policies tested with different user roles
- [ ] Indexes created for query performance
- [ ] Database comments added for documentation
- [ ] Schema matches Drizzle ORM definitions

## Files Modified
- `db/migrations/008_org_following_cosmetics.sql`
- `apps/api/src/database/schema.ts`

## Related Tickets
- F-2: Seed & Brand Tokens
- F-3: API – Follow/Unfollow
- F-4: API – Org Titles
