# [EPIC A] Monorepo & Tooling — [TICKET] Monorepo Bootstrap

## Summary
Set up a production-grade monorepo structure with pnpm workspaces, TypeScript project references, shared configurations, and essential build scripts for the Cedarlume marketplace platform.

## Acceptance Criteria
- [ ] pnpm workspaces configured with apps/* and packages/* structure
- [ ] TypeScript project references set up for proper dependency management
- [ ] Shared ESLint, Prettier, and TypeScript configs in packages/config
- [ ] Root-level scripts: build, test, lint, typecheck, dev, clean
- [ ] Package.json with proper workspace dependencies
- [ ] .gitignore configured for Node.js, React Native, and build artifacts

## Definition of Done
- All scripts run successfully from root
- TypeScript compilation works across all packages
- Linting and formatting rules are consistent
- CI job can run lint/type/test commands
- Commit hooks configured (husky + lint-staged)

## Tech Notes
- Use pnpm for fast, efficient package management
- Configure TypeScript project references for proper build ordering
- Set up strict TypeScript configs with noImplicitAny, strictNullChecks
- Include React Native specific configs for mobile app
- Ensure all shared configs are properly exported and consumed
