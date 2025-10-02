-- Migration: Organization Following & Cosmetics
-- Creates tables for org following, titles, and feed items

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for org feed item kinds
CREATE TYPE org_item_kind AS ENUM ('EVENT', 'NEWS', 'PROJECT');

-- Organization follows relationship
CREATE TABLE organization_follows (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, org_id)
);

-- Organization titles/cosmetics
CREATE TABLE org_titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- e.g., 'conservation-steward'
  name TEXT NOT NULL,
  description TEXT,
  border_token TEXT, -- UI token name for border styling
  icon_token TEXT, -- UI token name for icon
  rules JSONB NOT NULL, -- declarative conditions for earning
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX org_titles_org_code_uidx ON org_titles(org_id, code);
CREATE INDEX org_titles_org_id_idx ON org_titles(org_id);

-- User earned org titles
CREATE TABLE user_org_titles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES org_titles(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, org_id, title_id)
);

CREATE INDEX user_org_titles_user_id_idx ON user_org_titles(user_id);
CREATE INDEX user_org_titles_org_id_idx ON user_org_titles(org_id);

-- Organization feed items (events, news, projects)
CREATE TABLE org_feed_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  kind org_item_kind NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  location GEOGRAPHY(POINT,4326), -- NEWS anchored at HQ if null externally
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  url TEXT,
  image_url TEXT,
  data JSONB, -- additional structured data
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for org feed items
CREATE INDEX org_feed_geo_idx ON org_feed_items USING GIST (location);
CREATE INDEX org_feed_kind_idx ON org_feed_items (org_id, kind, starts_at DESC);
CREATE INDEX org_feed_published_idx ON org_feed_items (is_published, created_at DESC);
CREATE INDEX org_feed_org_kind_published_idx ON org_feed_items (org_id, kind, is_published, starts_at DESC);

-- Add updated_at trigger for org_titles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_org_titles_updated_at 
    BEFORE UPDATE ON org_titles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_org_feed_items_updated_at 
    BEFORE UPDATE ON org_feed_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Organization follows - users can only manage their own follows
ALTER TABLE organization_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY follows_self_rw ON organization_follows
  USING (user_id::text = current_setting('app.user_id', true))
  WITH CHECK (user_id::text = current_setting('app.user_id', true));

-- Allow public read of follows for approved orgs
CREATE POLICY follows_public_read ON organization_follows FOR SELECT USING (
  EXISTS(SELECT 1 FROM organizations o WHERE o.id = org_id AND o.status = 'approved')
);

-- Org titles - public read for approved orgs
ALTER TABLE org_titles ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_titles_public_read ON org_titles FOR SELECT USING (
  EXISTS(SELECT 1 FROM organizations o WHERE o.id = org_id AND o.status = 'approved')
);

-- Admin can manage titles for their orgs
CREATE POLICY org_titles_org_admin_rw ON org_titles
  USING (
    EXISTS(
      SELECT 1 FROM organization_admins oa 
      WHERE oa.user_id::text = current_setting('app.user_id', true) 
      AND oa.org_id = org_titles.org_id
    )
  )
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM organization_admins oa 
      WHERE oa.user_id::text = current_setting('app.user_id', true) 
      AND oa.org_id = org_titles.org_id
    )
  );

-- User org titles - users can only see their own
ALTER TABLE user_org_titles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_org_titles_self_read ON user_org_titles FOR SELECT USING (
  user_id::text = current_setting('app.user_id', true)
);

-- System can insert user titles (for award process)
CREATE POLICY user_org_titles_system_insert ON user_org_titles FOR INSERT
  WITH CHECK (true); -- Award system will handle validation

-- Org feed items - public read for approved orgs
ALTER TABLE org_feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY feed_public_read ON org_feed_items FOR SELECT USING (
  is_published = true AND
  EXISTS(SELECT 1 FROM organizations o WHERE o.id = org_id AND o.status = 'approved')
);

-- Org admins can manage their feed items
CREATE POLICY feed_org_admin_rw ON org_feed_items
  USING (
    EXISTS(
      SELECT 1 FROM organization_admins oa 
      WHERE oa.user_id::text = current_setting('app.user_id', true) 
      AND oa.org_id = org_feed_items.org_id
    )
  )
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM organization_admins oa 
      WHERE oa.user_id::text = current_setting('app.user_id', true) 
      AND oa.org_id = org_feed_items.org_id
    )
  );

-- Add comments for documentation
COMMENT ON TABLE organization_follows IS 'User follows organizations to get org-specific content and achievements';
COMMENT ON TABLE org_titles IS 'Organization-specific titles/badges that users can earn';
COMMENT ON TABLE user_org_titles IS 'User earned organization titles';
COMMENT ON TABLE org_feed_items IS 'Organization feed items (events, news, projects) with geospatial data';
COMMENT ON COLUMN org_feed_items.location IS 'Geographic location; NEWS items default to org HQ if not specified';
COMMENT ON COLUMN org_titles.rules IS 'JSONB rules for earning this title (e.g., {"min_volunteer_hours": 10, "org_id": "uuid"})';
