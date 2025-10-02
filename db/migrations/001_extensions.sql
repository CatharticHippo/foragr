-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE listing_type AS ENUM ('volunteer_shift', 'cash_campaign');
CREATE TYPE donation_method AS ENUM ('stripe', 'apple_pay', 'google_pay');
CREATE TYPE app_status AS ENUM ('new', 'review', 'accepted', 'scheduled', 'completed', 'cancelled');
CREATE TYPE org_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE user_role AS ENUM ('user', 'org_admin', 'super_admin');

-- Create audit trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
