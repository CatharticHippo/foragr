# H-3: Design Tokens

## Epic
**H: Profile Status**

## Description
Create design tokens for status colors, borders, and UI theming with dark mode support.

## Acceptance Criteria
- [ ] Status color tokens (Member/Volunteer/Donor)
- [ ] Organization color tokens
- [ ] Typography tokens
- [ ] Spacing and border radius tokens
- [ ] Dark mode variants
- [ ] WCAG AA compliance
- [ ] Component library with tokens

## Technical Details

### Status Colors
- **Member**: Blue (#1F6FEB) with light background
- **Volunteer**: Green (#10B981) with emphasis for shifts
- **Donor**: Amber (#F59E0B) with emphasis for giving
- Dark mode variants for all colors

### Organization Colors
- **RMEF**: Green primary, Orange secondary
- **EPI**: Sky blue primary, Emerald secondary
- **FOY**: Purple primary, Amber secondary

### Typography System
- Font sizes: xs (12) to 6xl (60)
- Font weights: normal to extrabold
- Line heights: none to loose
- Letter spacing: tighter to widest

### Spacing System
- Consistent spacing scale (0-96)
- Border radius options (none to full)
- Border width options (0-8)

### Components Created
- `StatusPill`: Status badge with verification
- `XPBar`: Progress bar with level info
- `OrgChip`: Organization selector chip
- `MapPin`: Map marker with org theming

## Definition of Done
- [ ] Color tokens defined and documented
- [ ] Typography system complete
- [ ] Spacing system consistent
- [ ] Dark mode variants created
- [ ] Component library implemented
- [ ] WCAG AA compliance verified
- [ ] Theme export structure complete

## Files Modified
- `apps/mobile/src/theme/colors.ts`
- `apps/mobile/src/theme/typography.ts`
- `apps/mobile/src/theme/spacing.ts`
- `apps/mobile/src/theme/index.ts`
- `apps/mobile/src/components/StatusPill.tsx`
- `apps/mobile/src/components/XPBar.tsx`
- `apps/mobile/src/components/OrgChip.tsx`
- `apps/mobile/src/components/MapPin.tsx`

## Related Tickets
- H-2: Mobile – Profile Screen
- G-2: Mobile – Map Screen
- G-3: Mobile – List Screen
