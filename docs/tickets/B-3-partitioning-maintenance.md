# [EPIC B] Database & RLS — [TICKET] Partitioning & Maintenance

## Summary
Implement monthly partitioning for high-volume tables and set up maintenance scripts for data retention and database optimization.

## Acceptance Criteria
- [ ] Monthly partitions for attendance, donations, xp_events tables
- [ ] Automatic partition creation for future months
- [ ] Data retention policy scripts (e.g., keep 2 years of data)
- [ ] VACUUM and ANALYZE schedule
- [ ] Partition pruning working correctly
- [ ] Maintenance scripts for partition management

## Definition of Done
- Partitions are created automatically
- Old partitions are dropped according to retention policy
- Database maintenance runs on schedule
- Performance is optimized with partition pruning
- Maintenance scripts are tested and documented
- Monitoring for partition health

## Tech Notes
- Use date-based partitioning for time-series data
- Implement proper partition pruning
- Set up automated partition creation
- Consider data archival strategies
- Monitor partition performance
- Document maintenance procedures
