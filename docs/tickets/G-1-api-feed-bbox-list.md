# G-1: API – Feed BBox/List

## Epic
**G: Map Feed (Zillow-style)**

## Description
Implement API endpoints for feed items with bounding box queries and PostGIS integration.

## Acceptance Criteria
- [ ] `GET /feed/map` endpoint with bbox queries
- [ ] `GET /feed/list` endpoint with pagination
- [ ] PostGIS `ST_Intersects` and `ST_DWithin` queries
- [ ] Filtering by organization IDs and item kinds
- [ ] Clustering support for map view
- [ ] Pagination for list view
- [ ] Proper error handling and validation

## Technical Details

### Endpoints
1. **GET /feed/map**
   - Query params: `minLon`, `minLat`, `maxLon`, `maxLat`, `kinds[]`, `orgIds[]`, `cluster`
   - Returns feed items within bounding box
   - Supports clustering for performance

2. **GET /feed/list**
   - Query params: `minLon`, `minLat`, `maxLon`, `maxLat`, `kinds[]`, `orgIds[]`, `page`, `limit`
   - Returns paginated feed items
   - Synced to current map bounds

### Query Features
- Bounding box filtering using PostGIS
- Organization filtering (followed orgs if none specified)
- Item kind filtering (EVENT, NEWS, PROJECT)
- Pagination with metadata
- Clustering support for map performance

### Response Format
```typescript
{
  items: FeedItemDto[],
  total: number,
  page: number,
  limit: number,
  totalPages: number,
  hasMore: boolean
}
```

## Definition of Done
- [ ] Controllers and services implemented
- [ ] DTOs with proper validation
- [ ] PostGIS queries optimized
- [ ] OpenAPI documentation complete
- [ ] Unit tests with 90%+ coverage
- [ ] Performance tests for large datasets

## Files Modified
- `apps/api/src/feed/feed.controller.ts`
- `apps/api/src/feed/feed.service.ts`
- `apps/api/src/feed/dto/feed-query.dto.ts`
- `apps/api/src/feed/dto/feed-item.dto.ts`
- `apps/api/src/feed/feed.module.ts`

## Related Tickets
- G-2: Mobile – Map Screen
- G-3: Mobile – List Screen
- F-1: DDL & RLS
