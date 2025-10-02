# [EPIC B] Database & RLS — [TICKET] Materialized Views

## Summary
Create materialized views for feeds and leaderboards with automatic refresh triggers from outbox events.

## Acceptance Criteria
- [ ] Materialized views for user feeds and leaderboards
- [ ] Refresh functions for materialized views
- [ ] Triggers to refresh views from outbox events
- [ ] Proper indexes on materialized views
- [ ] Refresh scheduling for performance
- [ ] Monitoring for view staleness

## Definition of Done
- Materialized views are created and populated
- Refresh triggers work correctly
- Views are updated within 60 seconds of data changes
- Performance is acceptable for feed queries
- Monitoring shows view freshness
- Documentation for view maintenance

## Tech Notes
- Use materialized views for complex aggregations
- Implement incremental refresh where possible
- Consider using pg_cron for scheduled refreshes
- Monitor view staleness and performance
- Document refresh strategies
- Test view performance under load
