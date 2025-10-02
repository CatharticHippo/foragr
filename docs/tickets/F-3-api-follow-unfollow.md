# F-3: API – Follow/Unfollow

## Epic
**F: Org Following & Cosmetics**

## Description
Implement API endpoints for following and unfollowing organizations with outbox events.

## Acceptance Criteria
- [ ] `POST /organizations/:id/follow` endpoint
- [ ] `GET /organizations/following` endpoint
- [ ] Idempotent follow/unfollow operations
- [ ] Outbox events for `org.followed` and `org.unfollowed`
- [ ] Proper error handling and validation
- [ ] OpenAPI documentation
- [ ] Unit tests for all endpoints

## Technical Details

### Endpoints
1. **POST /organizations/:id/follow**
   - Body: `{ follow?: boolean }` (defaults to true)
   - Response: `{ following: boolean, action: 'followed' | 'unfollowed', orgId: string, userId: string }`
   - Idempotent: no-op if already in desired state

2. **GET /organizations/following**
   - Response: Array of followed organizations with metadata
   - Includes feed item count and title count per org

### Outbox Events
- `org.followed`: Emitted when user follows an organization
- `org.unfollowed`: Emitted when user unfollows an organization
- Payload includes userId, orgId, and organizationName

### Validation
- Organization must exist and be approved
- User must be authenticated
- Follow/unfollow operations are idempotent

## Definition of Done
- [ ] Controllers and services implemented
- [ ] DTOs with proper validation
- [ ] Outbox events integrated
- [ ] OpenAPI documentation complete
- [ ] Unit tests with 90%+ coverage
- [ ] Integration tests for happy path and error cases

## Files Modified
- `apps/api/src/organizations/organizations.controller.ts`
- `apps/api/src/organizations/organizations.service.ts`
- `apps/api/src/organizations/dto/follow-organization.dto.ts`
- `apps/api/src/organizations/dto/organization-follow.dto.ts`
- `apps/api/src/organizations/organizations.module.ts`

## Related Tickets
- F-1: DDL & RLS
- F-2: Seed & Brand Tokens
- F-4: API – Org Titles
