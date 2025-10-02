# [EPIC C] API (NestJS) — [TICKET] Listings & Shifts

## Summary
Implement CRUD operations for listings and shifts with full-text search, proximity search, and map-based queries.

## Acceptance Criteria
- [ ] CRUD operations for listings and shifts
- [ ] Full-text search with pg_trgm
- [ ] Proximity search using PostGIS
- [ ] Map bounding box queries
- [ ] Pagination for search results
- [ ] Input validation with Zod schemas
- [ ] Geospatial indexing
- [ ] Search result ranking

## Definition of Done
- All CRUD operations working
- Search functionality is fast and accurate
- Geospatial queries work correctly
- Pagination is efficient
- Validation prevents invalid data
- API tests pass
- Performance is acceptable

## Tech Notes
- Use PostGIS for geospatial operations
- Implement proper full-text search with ranking
- Use GIST indexes for geospatial queries
- Implement efficient pagination with cursors
- Use Zod for input validation
- Consider search result caching
- Implement search analytics
