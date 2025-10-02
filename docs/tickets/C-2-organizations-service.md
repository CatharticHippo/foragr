# [EPIC C] API (NestJS) — [TICKET] Organizations Service

## Summary
Build CRUD operations for organizations with admin membership management and status transitions from pending to approved.

## Acceptance Criteria
- [ ] CRUD operations for organizations
- [ ] RLS policies for organization data
- [ ] Admin membership management
- [ ] Status transitions (pending → approved)
- [ ] Organization verification workflow
- [ ] Stripe Connect integration for payments
- [ ] Organization profile management
- [ ] Admin invitation system

## Definition of Done
- All CRUD operations working
- RLS policies tested and secure
- Admin membership is properly managed
- Status transitions are validated
- Stripe Connect is integrated
- Admin invitations work
- API tests pass

## Tech Notes
- Use RLS for organization data isolation
- Implement proper validation for status transitions
- Integrate with Stripe Connect for payment processing
- Use email invitations for admin management
- Implement audit logging for organization changes
- Consider organization hierarchy in future
