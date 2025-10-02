-- Partitioning for high-volume tables

-- Create partitioned tables for attendance
CREATE TABLE attendance_partitioned (
    LIKE attendance INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for attendance (example for current year)
CREATE TABLE attendance_2024_01 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE attendance_2024_02 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE attendance_2024_03 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

CREATE TABLE attendance_2024_04 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');

CREATE TABLE attendance_2024_05 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');

CREATE TABLE attendance_2024_06 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');

CREATE TABLE attendance_2024_07 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');

CREATE TABLE attendance_2024_08 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');

CREATE TABLE attendance_2024_09 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');

CREATE TABLE attendance_2024_10 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');

CREATE TABLE attendance_2024_11 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE TABLE attendance_2024_12 PARTITION OF attendance_partitioned
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Create partitioned tables for donations
CREATE TABLE donations_partitioned (
    LIKE donations INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for donations
CREATE TABLE donations_2024_01 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE donations_2024_02 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE donations_2024_03 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

CREATE TABLE donations_2024_04 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');

CREATE TABLE donations_2024_05 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');

CREATE TABLE donations_2024_06 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');

CREATE TABLE donations_2024_07 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');

CREATE TABLE donations_2024_08 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');

CREATE TABLE donations_2024_09 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');

CREATE TABLE donations_2024_10 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');

CREATE TABLE donations_2024_11 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE TABLE donations_2024_12 PARTITION OF donations_partitioned
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Create partitioned tables for xp_events
CREATE TABLE xp_events_partitioned (
    LIKE xp_events INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for xp_events
CREATE TABLE xp_events_2024_01 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE xp_events_2024_02 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE xp_events_2024_03 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

CREATE TABLE xp_events_2024_04 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');

CREATE TABLE xp_events_2024_05 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');

CREATE TABLE xp_events_2024_06 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');

CREATE TABLE xp_events_2024_07 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');

CREATE TABLE xp_events_2024_08 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');

CREATE TABLE xp_events_2024_09 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');

CREATE TABLE xp_events_2024_10 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');

CREATE TABLE xp_events_2024_11 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE TABLE xp_events_2024_12 PARTITION OF xp_events_partitioned
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Function to create monthly partitions automatically
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name TEXT, start_date DATE)
RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
    end_date DATE;
    sql_statement TEXT;
BEGIN
    -- Calculate partition name and end date
    partition_name := table_name || '_' || TO_CHAR(start_date, 'YYYY_MM');
    end_date := start_date + INTERVAL '1 month';
    
    -- Create partition
    sql_statement := format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        table_name,
        start_date,
        end_date
    );
    
    EXECUTE sql_statement;
END;
$$ LANGUAGE plpgsql;

-- Function to create partitions for next 12 months
CREATE OR REPLACE FUNCTION create_future_partitions()
RETURNS VOID AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    i INTEGER;
BEGIN
    -- Create partitions for next 12 months
    FOR i IN 0..11 LOOP
        PERFORM create_monthly_partition('attendance_partitioned', current_date + (i || ' months')::INTERVAL);
        PERFORM create_monthly_partition('donations_partitioned', current_date + (i || ' months')::INTERVAL);
        PERFORM create_monthly_partition('xp_events_partitioned', current_date + (i || ' months')::INTERVAL);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to drop old partitions (older than 2 years)
CREATE OR REPLACE FUNCTION drop_old_partitions()
RETURNS VOID AS $$
DECLARE
    partition_record RECORD;
    cutoff_date DATE := CURRENT_DATE - INTERVAL '2 years';
BEGIN
    -- Drop old attendance partitions
    FOR partition_record IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE tablename LIKE 'attendance_%'
        AND tablename ~ '^attendance_[0-9]{4}_[0-9]{2}$'
        AND tablename < 'attendance_' || TO_CHAR(cutoff_date, 'YYYY_MM')
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I.%I', partition_record.schemaname, partition_record.tablename);
    END LOOP;
    
    -- Drop old donations partitions
    FOR partition_record IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE tablename LIKE 'donations_%'
        AND tablename ~ '^donations_[0-9]{4}_[0-9]{2}$'
        AND tablename < 'donations_' || TO_CHAR(cutoff_date, 'YYYY_MM')
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I.%I', partition_record.schemaname, partition_record.tablename);
    END LOOP;
    
    -- Drop old xp_events partitions
    FOR partition_record IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE tablename LIKE 'xp_events_%'
        AND tablename ~ '^xp_events_[0-9]{4}_[0-9]{2}$'
        AND tablename < 'xp_events_' || TO_CHAR(cutoff_date, 'YYYY_MM')
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I.%I', partition_record.schemaname, partition_record.tablename);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create indexes on partitioned tables
CREATE INDEX idx_attendance_partitioned_user_id ON attendance_partitioned(user_id);
CREATE INDEX idx_attendance_partitioned_shift_id ON attendance_partitioned(shift_id);
CREATE INDEX idx_attendance_partitioned_created_at ON attendance_partitioned(created_at);

CREATE INDEX idx_donations_partitioned_user_id ON donations_partitioned(user_id);
CREATE INDEX idx_donations_partitioned_org_id ON donations_partitioned(organization_id);
CREATE INDEX idx_donations_partitioned_created_at ON donations_partitioned(created_at);

CREATE INDEX idx_xp_events_partitioned_user_id ON xp_events_partitioned(user_id);
CREATE INDEX idx_xp_events_partitioned_event_type ON xp_events_partitioned(event_type);
CREATE INDEX idx_xp_events_partitioned_created_at ON xp_events_partitioned(created_at);
