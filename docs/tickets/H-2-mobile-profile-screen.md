# H-2: Mobile – Profile Screen

## Epic
**H: Profile Status**

## Description
Implement mobile profile screen with status badge, XP progress, and earned titles display.

## Acceptance Criteria
- [ ] Profile screen with user information
- [ ] Status badge with verification checkmark
- [ ] XP progress bar with level information
- [ ] Statistics grid (XP, titles, organizations)
- [ ] Earned titles grid with organization info
- [ ] Pull-to-refresh functionality
- [ ] Dark mode support
- [ ] Responsive design

## Technical Details

### Screen Components
1. **Header Section**
   - Profile image or initials
   - User name and email
   - Status badge with verification

2. **Progress Section**
   - XP progress bar
   - Current level and next level target
   - Progress percentage

3. **Statistics Grid**
   - Total XP points
   - Titles earned count
   - Organizations followed count

4. **Earned Titles Grid**
   - Title cards with organization info
   - Award date and XP reward
   - Tap to view description

### Design Requirements
- WCAG AA compliant colors
- Dark mode support
- Responsive layout
- Pull-to-refresh
- Loading and error states

### Status Badge Features
- Color-coded by status (Member/Volunteer/Donor)
- Verification checkmark for verified status
- "Since" date for status achievement

## Definition of Done
- [ ] Profile screen implemented
- [ ] All components working correctly
- [ ] Dark mode support
- [ ] Pull-to-refresh functional
- [ ] Loading and error states handled
- [ ] Responsive design tested
- [ ] Accessibility features implemented

## Files Modified
- `apps/mobile/src/screens/ProfileScreen.tsx`
- `apps/mobile/app/(tabs)/profile.tsx`
- `apps/mobile/app/(tabs)/_layout.tsx`

## Related Tickets
- H-1: API – Status & Progress
- H-3: Design Tokens
- F-3: API – Follow/Unfollow
