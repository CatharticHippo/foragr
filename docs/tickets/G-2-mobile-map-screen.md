# G-2: Mobile – Map Screen

## Epic
**G: Map Feed (Zillow-style)**

## Description
Implement mobile map screen with clustering, filters, and organization theming.

## Acceptance Criteria
- [ ] Map view with react-native-maps
- [ ] Organization filter chips
- [ ] Item kind filters (Events/News/Projects)
- [ ] Map/list view toggle
- [ ] Clustered markers for performance
- [ ] Organization-themed pin styling
- [ ] Bounding box queries
- [ ] Dark mode support

## Technical Details

### Map Features
- Google Maps integration via react-native-maps
- Clustered markers for performance (<300 markers)
- Organization-themed pin colors
- User location display
- Bounding box-based data loading

### Filtering System
- Organization chips with multi-select
- Item kind filters (EVENT, NEWS, PROJECT)
- "All" option for clearing filters
- Real-time filtering of map markers

### View Modes
- **Map View**: Default with clustered pins
- **List View**: Scrollable list synced to map bounds
- Toggle button in header
- Persist user's last choice

### Pin Styling
- Different icons for each item kind
- Organization primary color theming
- Selected state highlighting
- Accessible callouts

### Performance Optimizations
- Clustering to keep <300 markers rendered
- 60fps map panning
- Memoized markers
- Viewport-aware queries

## Definition of Done
- [ ] Map screen implemented
- [ ] Clustering working correctly
- [ ] Filters functional
- [ ] Map/list toggle working
- [ ] Organization theming applied
- [ ] Performance optimized
- [ ] Dark mode support
- [ ] Accessibility features

## Files Modified
- `apps/mobile/src/screens/MapFeedScreen.tsx`
- `apps/mobile/app/(tabs)/explore.tsx`
- `apps/mobile/package.json` (react-native-maps dependency)

## Related Tickets
- G-1: API – Feed BBox/List
- G-3: Mobile – List Screen
- H-3: Design Tokens
