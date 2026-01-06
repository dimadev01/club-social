# Club Social API

NestJS backend API following Domain-Driven Design (DDD) principles.

## Tech Stack

- NestJS 11
- PostgreSQL with Prisma ORM
- Better Auth (authentication with passkey support)
- BullMQ (background jobs via Redis)
- Winston (logging with Better Stack integration)

## Development

```bash
# Start in development mode (with hot reload)
npm run start:dev

# Start in debug mode
npm run start:debug

# Start production build
npm run start:prod
```

## Database

```bash
# Generate Prisma client
npm run generate-schema

# Create and apply a new migration
npm run new-migration

# Apply migrations only (production)
npm run migrate

# Reset database (destructive!)
npm run reset-database
```

## Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Other Commands

```bash
# Build the API
npm run build

# Type check
npm run check-types

# Lint and fix
npm run lint

# Format code
npm run format

# Generate Better Auth client
npm run better-auth:generate
```

## Project Structure

```
src/
├── members/           # Member management domain
├── users/             # User & authentication domain
├── payments/          # Payment processing domain
├── dues/              # Membership dues domain
├── movements/         # Financial movements domain
├── pricing/           # Pricing configuration domain
├── audit/             # Audit logging domain
├── shared/            # Shared utilities, base classes, value objects
└── infrastructure/    # Database, auth, logging, queue, email
```

## Environment Variables

See `.env.example` for required configuration. Key variables:

- `DATABASE_URI` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth encryption secret
- `BETTER_AUTH_URL` - Auth service URL
- `TRUSTED_ORIGINS` - Allowed frontend origins
- `REDIS_HOST`, `REDIS_PORT` - Redis for BullMQ

Test inside /api
