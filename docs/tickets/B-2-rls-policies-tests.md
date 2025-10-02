# [EPIC B] Database & RLS — [TICKET] RLS Policies + Tests

## Summary
Implement Row Level Security (RLS) policies for all tables with comprehensive test coverage to ensure proper data isolation and security.

## Acceptance Criteria
- [ ] RLS enabled on all tables
- [ ] Users can only read/write their own data
- [ ] Organization admins can only access their organization's data
- [ ] Public read access for approved organizations and active listings
- [ ] Use session parameter `app.user_id` for RLS predicates
- [ ] Comprehensive RLS test suite with Jest
- [ ] Helper functions to set `app.user_id` in tests

## Definition of Done
- All RLS policies tested and working
- Test coverage for all security scenarios
- No data leakage between users/organizations
- Performance impact of RLS is acceptable
- Documentation for RLS policies
- Security audit passes

## Tech Notes
- Use `app.user_id` session parameter for user context
- Implement proper role-based access control
- Test edge cases like user deletion, organization changes
- Consider performance implications of RLS
- Use proper indexes to support RLS queries
- Document security model and access patterns
