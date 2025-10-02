# Cedarlume Marketplace - Development Runbook

## Overview

This runbook provides comprehensive instructions for setting up, developing, and deploying the Cedarlume Nonprofit Community Marketplace MVP.

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **Docker**: v20.0.0 or higher
- **Docker Compose**: v2.0.0 or higher
- **PostgreSQL**: v15+ (if running locally without Docker)
- **Git**: Latest version

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd cedarlume-marketplace

# Install dependencies
pnpm install

# Copy environment variables
cp env.example .env
# Edit .env with your configuration
```

### 2. Start Development Environment

```bash
# Start all services with Docker Compose
docker compose up -d

# Wait for services to be healthy
docker compose ps

# Run database migrations
pnpm db:migrate

# Seed the database
pnpm db:seed
```

### 3. Access Services

- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Mobile App**: http://localhost:8081 (Expo DevTools)
- **Admin Panel**: http://localhost:3001
- **Database**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379

## Development Workflow

### Monorepo Commands

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build

# Run tests for all packages
pnpm test

# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Start development servers for all packages
pnpm dev
```

### Individual Package Commands

```bash
# API development
cd apps/api
pnpm start:dev

# Mobile development
cd apps/mobile
pnpm start

# Admin development
cd apps/admin
pnpm dev
```

## Database Management

### Migrations

```bash
# Generate new migration
cd apps/api
pnpm db:generate

# Run migrations
pnpm db:migrate

# Reset database (WARNING: This will delete all data)
pnpm db:reset
```

### Seeding

```bash
# Seed development data
pnpm db:seed

# Seed specific data
cd apps/api
pnpm db:seed --file=badges
```

### Database Access

```bash
# Connect to database
docker exec -it cedarlume-postgres psql -U postgres -d cedarlume

# View logs
docker logs cedarlume-postgres

# Backup database
docker exec cedarlume-postgres pg_dump -U postgres cedarlume > backup.sql

# Restore database
docker exec -i cedarlume-postgres psql -U postgres -d cedarlume < backup.sql
```

### New Features Database Schema

The following new tables have been added for organization following and feed functionality:

- **organization_follows**: User follows organizations
- **org_titles**: Organization-specific titles/badges
- **user_org_titles**: User earned organization titles
- **org_feed_items**: Organization feed items (events, news, projects)

Run the new migrations to add these features:

```bash
# Apply new migrations
pnpm db:migrate

# Seed demo data for new features
pnpm db:seed
```

## API Development

### Project Structure

```
apps/api/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── organizations/  # Organization management
│   ├── listings/       # Listing management
│   ├── applications/   # Application management
│   ├── attendance/     # Attendance tracking
│   ├── donations/      # Donation processing
│   ├── common/         # Shared utilities
│   └── database/       # Database schema and migrations
├── test/               # Test files
└── drizzle/            # Generated migrations
```

### Key Features

- **Authentication**: JWT + OAuth (Google, Apple)
- **Database**: PostgreSQL with PostGIS, RLS policies
- **Validation**: Zod schemas with class-validator
- **Documentation**: Auto-generated OpenAPI/Swagger
- **Testing**: Jest with supertest for e2e tests

### API Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `GET /auth/google` - Google OAuth
- `GET /auth/apple` - Apple OAuth
- `GET /auth/me` - Get current user

#### Users
- `GET /users` - List users
- `GET /users/me` - Get current user profile
- `GET /users/me/stats` - Get user statistics
- `GET /users/me/badges` - Get user badges
- `PATCH /users/me` - Update profile

#### Organizations
- `GET /organizations` - List organizations
- `POST /organizations` - Create organization
- `GET /organizations/:id` - Get organization
- `PATCH /organizations/:id` - Update organization
- `POST /organizations/:id/follow` - Follow/unfollow organization
- `GET /organizations/following` - Get followed organizations

#### Listings
- `GET /listings` - List listings with search/filters
- `POST /listings` - Create listing
- `GET /listings/:id` - Get listing details
- `PATCH /listings/:id` - Update listing

#### Applications
- `GET /applications` - List user applications
- `POST /applications` - Apply to listing
- `PATCH /applications/:id` - Update application status

#### Attendance
- `POST /attendance/check-in` - Check in to shift
- `POST /attendance/check-out` - Check out of shift
- `GET /attendance` - List attendance records

#### Donations
- `POST /donations/checkout` - Create Stripe checkout session
- `POST /donations/webhook` - Stripe webhook handler
- `GET /donations` - List user donations

#### Feed
- `GET /feed/map` - Get feed items for map view with bbox queries
- `GET /feed/list` - Get feed items for list view with pagination

#### Profile
- `GET /profile/status` - Get user status and progress information

## Mobile App Development

### Project Structure

```
apps/mobile/
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation setup
│   ├── services/       # API services
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript types
├── assets/             # Images, fonts, etc.
└── app.json           # Expo configuration
```

### Key Features

- **Framework**: Expo React Native with TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Query for server state
- **Offline Support**: SQLite for local storage
- **Maps**: React Native Maps with clustering
- **Payments**: Stripe React Native SDK
- **QR Codes**: React Native Camera for scanning
- **Organization Following**: Follow organizations for personalized feeds
- **Status System**: Member/Volunteer/Donor status with XP progression
- **Map-First Feed**: Zillow-style map with list toggle

### Development

```bash
# Start Expo development server
cd apps/mobile
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Build for production
pnpm build:ios
pnpm build:android
```

## Testing

### API Tests

```bash
# Run all tests
cd apps/api
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e

# Generate coverage report
pnpm test:cov
```

### Mobile Tests

```bash
# Run tests
cd apps/mobile
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Database Tests

```bash
# Test RLS policies
cd apps/api
pnpm test:db

# Test migrations
pnpm test:migrations
```

## Deployment

### Production Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/cedarlume

# JWT Secrets (generate strong secrets)
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret

# OAuth (configure in respective developer consoles)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Stripe (use live keys)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# Frontend URLs
FRONTEND_URL=https://your-mobile-app.com
ADMIN_URL=https://admin.cedarlume.com
```

### Docker Production Build

```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Deploy to production
docker compose -f docker-compose.prod.yml up -d
```

### Database Migration in Production

```bash
# Run migrations
docker exec cedarlume-api pnpm db:migrate

# Verify migration status
docker exec cedarlume-api pnpm db:status
```

## Monitoring and Observability

### Health Checks

```bash
# Check API health
curl http://localhost:3000/health

# Check database health
docker exec cedarlume-postgres pg_isready -U postgres

# Check Redis health
docker exec cedarlume-redis redis-cli ping
```

### Logs

```bash
# View all logs
docker compose logs

# View specific service logs
docker compose logs api
docker compose logs postgres
docker compose logs redis

# Follow logs in real-time
docker compose logs -f api
```

### Performance Monitoring

- **API Response Times**: Monitor p95 latency < 300ms
- **Database Performance**: Monitor query execution times
- **Webhook Success Rate**: Monitor Stripe webhook success ≥ 99.9%
- **Materialized View Freshness**: Monitor staleness ≤ 60s

## Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker exec cedarlume-postgres psql -U postgres -d cedarlume -c "SELECT 1"
```

#### API Not Starting

```bash
# Check logs
docker compose logs api

# Check environment variables
docker exec cedarlume-api env | grep DATABASE_URL

# Restart API service
docker compose restart api
```

#### Mobile App Issues

```bash
# Clear Expo cache
cd apps/mobile
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache

# Check device connection
npx expo start --tunnel
```

#### Database Migration Issues

```bash
# Check migration status
cd apps/api
pnpm db:status

# Rollback last migration
pnpm db:rollback

# Reset and re-run migrations
pnpm db:reset && pnpm db:migrate
```

### Performance Issues

#### Slow API Responses

1. Check database query performance
2. Verify indexes are being used
3. Check for N+1 query problems
4. Monitor connection pool usage

#### High Memory Usage

1. Check for memory leaks in Node.js
2. Monitor database connection pool
3. Check Redis memory usage
4. Review application logs for errors

## Security Considerations

### Development

- Never commit secrets to version control
- Use different secrets for each environment
- Regularly rotate API keys and tokens
- Enable RLS policies in development

### Production

- Use strong, unique secrets
- Enable HTTPS everywhere
- Implement rate limiting
- Monitor for security vulnerabilities
- Regular security audits

## Contributing

### Code Standards

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write tests for new features
- Document API changes
- Use conventional commit messages

### Pull Request Process

1. Create feature branch from main
2. Implement changes with tests
3. Update documentation if needed
4. Run full test suite
5. Submit pull request with description
6. Address review feedback
7. Merge after approval

## Support

For issues and questions:

1. Check this runbook first
2. Search existing GitHub issues
3. Create new issue with detailed description
4. Include logs and error messages
5. Provide steps to reproduce

## Additional Resources

- [API Documentation](http://localhost:3000/api/docs)
- [Database Schema](./database/schema.md)
- [Mobile App Guide](./mobile/README.md)
- [Deployment Guide](./deployment/README.md)
- [Security Guide](./security/README.md)
