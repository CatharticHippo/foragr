# [EPIC C] API (NestJS) — [TICKET] Applications/RSVP

## Summary
Build application and RSVP system with status tracking from New → Review → Accepted → Scheduled → Completed.

## Acceptance Criteria
- [ ] Create and cancel applications/RSVPs
- [ ] View user's applications
- [ ] Organization pipeline management
- [ ] Status transitions with validation
- [ ] Application notifications
- [ ] Capacity management
- [ ] Waitlist functionality
- [ ] Application analytics

## Definition of Done
- Application flow is complete
- Status transitions are validated
- Notifications are sent
- Capacity is properly managed
- Waitlist works correctly
- API tests pass
- Performance is acceptable

## Tech Notes
- Implement proper state machine for status transitions
- Use database transactions for consistency
- Implement capacity checking
- Use outbox pattern for notifications
- Consider application prioritization
- Implement proper error handling
- Add application metrics
