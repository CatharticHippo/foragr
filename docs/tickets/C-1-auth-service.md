# [EPIC C] API (NestJS) — [TICKET] Auth Service (JWT, Refresh, OAuth)

## Summary
Implement comprehensive authentication service with JWT tokens, refresh tokens, OAuth providers, and passkey support.

## Acceptance Criteria
- [ ] Local email/password authentication
- [ ] Google OAuth integration
- [ ] Apple OAuth integration
- [ ] Passkey support (stub implementation)
- [ ] Short-lived JWT tokens (15 minutes)
- [ ] Refresh token rotation
- [ ] Token revocation list
- [ ] Password reset functionality
- [ ] Account verification

## Definition of Done
- All authentication methods working
- JWT tokens are properly signed and validated
- Refresh token rotation is secure
- OAuth flows are complete
- Password reset works via email
- Account verification is functional
- Security tests pass

## Tech Notes
- Use JWT with RS256 for token signing
- Implement refresh token rotation for security
- Store refresh tokens in database with expiration
- Use proper OAuth 2.0 flows
- Implement rate limiting for auth endpoints
- Use secure password hashing (bcrypt)
- Consider implementing 2FA in future
