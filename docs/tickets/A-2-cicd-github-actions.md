# [EPIC A] Monorepo & Tooling — [TICKET] CI/CD GitHub Actions

## Summary
Implement comprehensive CI/CD pipeline with GitHub Actions for automated testing, building, and deployment of the monorepo packages.

## Acceptance Criteria
- [ ] Matrix build for api and mobile apps
- [ ] Cache node_modules and build artifacts for performance
- [ ] Run lint, typecheck, and test commands
- [ ] Generate and upload test reports and coverage
- [ ] Code coverage gate (minimum 85% for core services)
- [ ] Build artifacts for deployment
- [ ] Security scanning for dependencies

## Definition of Done
- All CI jobs pass on clean repository
- Build times optimized with proper caching
- Test reports visible in GitHub UI
- Coverage reports generated and uploaded
- Security vulnerabilities detected and reported
- Deployment artifacts ready for staging/production

## Tech Notes
- Use pnpm for consistent package management in CI
- Cache pnpm store and node_modules for faster builds
- Run tests in parallel where possible
- Use GitHub's built-in security scanning
- Consider using actions/cache for build artifacts
- Set up proper environment variables for different stages
