# F-2: Seed & Brand Tokens

## Epic
**F: Org Following & Cosmetics**

## Description
Create seed data for 3 demo organizations with branding tokens, feed items, and demo titles.

## Acceptance Criteria
- [ ] Insert 3 demo organizations with HQ coordinates
- [ ] Add organization branding (logo URLs, primary/secondary colors)
- [ ] Create 12 feed items across organizations (mix of events, news, projects)
- [ ] Add geocoded locations for feed items
- [ ] Create demo titles for each organization
- [ ] Include sample user follows for demo purposes

## Technical Details

### Demo Organizations
1. **Rocky Mountain Elk Foundation**
   - HQ: Missoula, MT
   - Colors: Green primary, Orange secondary
   - Focus: Wildlife conservation, habitat restoration

2. **Ecology Project International**
   - HQ: Missoula, MT
   - Colors: Sky blue primary, Emerald secondary
   - Focus: Environmental education, field research

3. **Foster Our Youth**
   - HQ: Los Angeles, CA
   - Colors: Purple primary, Amber secondary
   - Focus: Youth mentorship, life skills

### Feed Items (12 total)
- 4 events with start/end times
- 4 news items anchored at HQ
- 4 projects with ongoing timelines
- Geocoded locations in Missoula, MT and Los Angeles, CA

### Demo Titles
- 3 titles per organization (9 total)
- Various earning conditions (volunteer hours, events, leadership roles)
- XP rewards ranging from 100-300 points

## Definition of Done
- [ ] Seed script created and tested
- [ ] All organizations have proper branding tokens
- [ ] Feed items have realistic content and locations
- [ ] Titles have meaningful earning conditions
- [ ] Sample user follows created for demo

## Files Modified
- `db/seed/008_org_following_demo_data.sql`

## Related Tickets
- F-1: DDL & RLS
- F-3: API – Follow/Unfollow
- F-4: API – Org Titles
