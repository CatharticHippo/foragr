# H-1: API – Status & Progress

## Epic
**H: Profile Status**

## Description
Implement API endpoints for computing user status and progress information.

## Acceptance Criteria
- [ ] `GET /profile/status` endpoint
- [ ] Status computation with precedence rules
- [ ] XP and level calculation
- [ ] Twelve-month verification windows
- [ ] User titles and achievements
- [ ] Followed organizations count

## Technical Details

### Status Precedence Rules
1. **Donor**: Recent donation in last 12 months (highest priority)
2. **Volunteer**: Completed verified attendance in last 12 months
3. **Member**: Default status (lowest priority)

### Response Format
```typescript
{
  status: {
    status: 'MEMBER' | 'VOLUNTEER' | 'DONOR',
    colorToken: string,
    verified: boolean,
    since?: Date,
    xp: number,
    level: number,
    nextLevelAt: number,
    progressPercentage: number
  },
  titles: UserOrgTitleDto[],
  followedOrgsCount: number
}
```

### XP and Level Calculation
- Simple level system: every 1000 XP = 1 level
- Progress percentage calculated for current level
- Next level target displayed

### Verification Logic
- Donor: Check for donations in last 12 months
- Volunteer: Check for verified attendance in last 12 months
- Member: Default status, not verified

## Definition of Done
- [ ] Controllers and services implemented
- [ ] Status computation logic tested
- [ ] XP calculation accurate
- [ ] OpenAPI documentation complete
- [ ] Unit tests with 90%+ coverage
- [ ] Edge cases handled (no donations, no attendance)

## Files Modified
- `apps/api/src/profile/profile.controller.ts`
- `apps/api/src/profile/profile.service.ts`
- `apps/api/src/profile/dto/profile-status.dto.ts`
- `apps/api/src/profile/profile.module.ts`

## Related Tickets
- H-2: Mobile – Profile Screen
- H-3: Design Tokens
- F-1: DDL & RLS
