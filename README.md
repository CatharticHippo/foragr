# Cedarlume Marketplace MVP

A production-grade MVP for Cedarlume's Nonprofit Community Marketplace with mobile-first UX and PostgreSQL/PostGIS core.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd cedarlume-marketplace
pnpm install

# Copy environment variables
cp env.example .env
# Edit .env with your configuration

# Start development environment
docker compose up -d

# Run database migrations and seed
pnpm db:migrate
pnpm db:seed

# Start all development servers
pnpm dev
```

## 📱 Access Services

- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Mobile App**: http://localhost:8081 (Expo DevTools)
- **Admin Panel**: http://localhost:3001

## 🏗️ Architecture

### Tech Stack

- **Mobile**: React Native (Expo), TypeScript, React Query, SQLite
- **Web/API**: Node.js, NestJS, TypeScript, OpenAPI
- **Database**: PostgreSQL 15+, PostGIS, RLS, pg-boss
- **Payments**: Stripe Connect
- **Infrastructure**: Docker, pgbouncer, Prisma/Drizzle ORM
- **Auth**: JWT + OAuth (Google/Apple), Passkeys
- **CI/CD**: GitHub Actions

### Project Structure

```
/apps
  /mobile        # Expo RN app (TypeScript)
  /api           # NestJS API (TypeScript)
  /admin         # Minimal admin web (Next.js)
/packages
  /sdk           # Typed client SDK generated from OpenAPI
  /ui            # Shared UI primitives
  /config        # ESLint, Prettier, TS configs
/db
  /migrations    # SQL migrations with RLS/partitioning
  /seed          # Seed scripts for dev
/docs
  /tickets       # Parsed tickets with AC & DOD
  /api           # OpenAPI spec
```

## 🎯 Core Features

### ✅ Implemented

- **Monorepo Setup**: pnpm workspaces, TypeScript project refs, shared configs
- **Database Schema**: Complete schema with RLS policies, partitioning, materialized views
- **API Services**: NestJS with authentication, organizations, listings, applications, attendance, donations
- **Mobile App**: Expo React Native with navigation, auth, offline support
- **Type-Safe SDK**: Generated from OpenAPI with Zod validation
- **CI/CD Pipeline**: GitHub Actions with testing, building, security scanning
- **Docker Setup**: Complete development environment with PostgreSQL, Redis, pgbouncer

### 🔄 In Progress

- **Admin Panel**: Organization approval, listing moderation
- **Push Notifications**: Real-time updates via outbox pattern
- **Advanced Features**: Geofencing, employer matching, advanced analytics

## 📊 Database Features

- **Row Level Security (RLS)**: Complete data isolation
- **PostGIS Integration**: Geospatial queries and proximity search
- **Partitioning**: Monthly partitions for high-volume tables
- **Materialized Views**: Optimized feeds and leaderboards
- **Audit Logging**: Complete change tracking
- **Outbox Pattern**: Reliable event processing

## 🔐 Security

- **Authentication**: JWT with refresh tokens, OAuth providers
- **Authorization**: Role-based access control with RLS
- **Data Protection**: PII minimization, secure storage
- **API Security**: Rate limiting, input validation, CORS
- **Infrastructure**: mTLS, KMS-managed secrets

## 🧪 Testing

```bash
# Run all tests
pnpm test

# API tests
cd apps/api && pnpm test

# Mobile tests
cd apps/mobile && pnpm test

# E2E tests
cd apps/api && pnpm test:e2e
```

## 📈 Performance

- **API Response Time**: p95 < 300ms
- **Webhook Success Rate**: ≥ 99.9%
- **Materialized View Freshness**: ≤ 60s
- **Database Optimization**: Proper indexing, connection pooling
- **Mobile Performance**: Offline-first, optimistic updates

## 🚀 Deployment

### Production Environment

```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Deploy to production
docker compose -f docker-compose.prod.yml up -d

# Run migrations
docker exec cedarlume-api pnpm db:migrate
```

### Environment Variables

See `env.example` for required environment variables. Key production settings:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong JWT signing secret
- `STRIPE_SECRET_KEY`: Live Stripe key
- `GOOGLE_CLIENT_ID`: OAuth client ID
- `FRONTEND_URL`: Production mobile app URL

## 📚 Documentation

- **[Development Runbook](docs/RUNBOOK.md)**: Comprehensive setup and development guide
- **[API Documentation](http://localhost:3000/api/docs)**: Auto-generated OpenAPI docs
- **[Database Schema](db/migrations/)**: Complete schema with migrations
- **[Tickets](docs/tickets/)**: Detailed feature specifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

### Code Standards

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Test coverage > 85%
- Documentation updates

## 📄 License

This project is proprietary software for Cedarlume.

## 🆘 Support

For issues and questions:

1. Check the [Runbook](docs/RUNBOOK.md)
2. Search existing GitHub issues
3. Create a new issue with detailed description

---

**Built with ❤️ for the nonprofit community**
