# [EPIC A] Monorepo & Tooling — [TICKET] Docker & Dev Containers

## Summary
Create Docker Compose setup with PostgreSQL+PostGIS+pgbouncer for local development, along with dev containers for API and mobile development.

## Acceptance Criteria
- [ ] docker-compose.yml with PostgreSQL 15+ and PostGIS extension
- [ ] pgbouncer configured for connection pooling
- [ ] API dev container with Node.js and dependencies
- [ ] Mobile dev container with React Native/Expo toolchain
- [ ] Seeded development data
- [ ] Environment variables properly configured
- [ ] Health checks for all services

## Definition of Done
- `docker compose up` starts all services successfully
- Database is seeded with development data
- API can connect to database through pgbouncer
- Mobile app can connect to API
- All services have proper health checks
- Development workflow documented

## Tech Notes
- Use official PostgreSQL image with PostGIS extension
- Configure pgbouncer for connection pooling (max 20 connections)
- Set up proper networking between containers
- Include volume mounts for development
- Use multi-stage builds for production images
- Configure proper logging and monitoring
