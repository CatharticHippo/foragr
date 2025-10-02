# G-3: Mobile – List Screen

## Epic
**G: Map Feed (Zillow-style)**

## Description
Implement mobile list screen synced to map bounds with infinite scroll and filtering.

## Acceptance Criteria
- [ ] List view synced to current map bounds
- [ ] Infinite scroll with pagination
- [ ] Skeleton loaders for loading states
- [ ] Empty state for no results
- [ ] Organization-themed list items
- [ ] Pull-to-refresh functionality
- [ ] Dark mode support

## Technical Details

### List Features
- Scrollable list view
- Synced to current map bounding box
- Infinite scroll with pagination
- Skeleton loaders during loading
- Empty state with helpful messaging

### List Items
- Organization-themed styling
- Item kind indicators
- Title and summary display
- Organization name and date
- Tap to view details

### Synchronization
- List always reflects current map bounds
- Real-time filtering with map
- Consistent data between map and list
- Smooth transitions between views

### Performance
- Pagination for large datasets
- Memoized list items
- Efficient re-rendering
- Optimized scroll performance

## Definition of Done
- [ ] List screen implemented
- [ ] Map/list synchronization working
- [ ] Infinite scroll functional
- [ ] Loading states handled
- [ ] Empty state implemented
- [ ] Performance optimized
- [ ] Dark mode support
- [ ] Accessibility features

## Files Modified
- `apps/mobile/src/screens/MapFeedScreen.tsx` (list view implementation)
- `apps/mobile/app/(tabs)/explore.tsx`

## Related Tickets
- G-1: API – Feed BBox/List
- G-2: Mobile – Map Screen
- H-3: Design Tokens
