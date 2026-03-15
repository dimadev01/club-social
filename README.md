# Club Social

A monorepo for managing club membership, dues, payments, and financial tracking.

[![codecov](https://codecov.io/gh/dimadev01/club-social/branch/main/graph/badge.svg?token=A5C3NJ0JPC)](https://codecov.io/gh/dimadev01/club-social)

## Tech Stack

- **Monorepo**: Turborepo with npm workspaces
- **Backend**: NestJS with Domain-Driven Design (DDD) architecture
- **Frontend**: React 19 + Vite + React Router 7 + Ant Design + TanStack Query
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth with passkey support
- **Queue**: BullMQ (Redis)
- **Email**: Resend / Nodemailer

## Project Structure

```
├── apps/
│   ├── api/              # NestJS backend API (DDD)
│   └── web/              # React frontend
├── packages/
│   ├── shared/           # Shared TypeScript types and enums
│   ├── eslint-config/    # Shared ESLint configuration
│   └── prettier-config/  # Shared Prettier configuration
```

## Prerequisites

- Node.js (see `.nvmrc` for version)
- npm 11+
- PostgreSQL
- Redis (for background jobs)

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy `.env.example` to `.env` in `apps/api` and configure the variables listed below.

3. **Generate Prisma client**

   ```bash
   cd apps/api
   npm run prisma:generate-schema
   ```

4. **Run database migrations**

   ```bash
   cd apps/api
   npm run prisma:migration:new
   ```

5. **Start development servers**

   ```bash
   # Build shared packages first
   npm run build

   # Then in separate terminals:
   cd apps/api && npm run start:dev
   cd apps/web && npm run dev
   ```

## Commands

### Root

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| `npm run build`       | Build all apps and packages (via Turbo)       |
| `npm run check`       | Run type checking, tests, linting, formatting |
| `npm run check-types` | Type check all workspaces                     |
| `npm run lint`        | Lint all workspaces                           |
| `npm run format`      | Format all workspaces                         |
| `npm run ncu`         | Interactively update dependencies             |

### API (`apps/api`)

| Command                                   | Description                            |
| ----------------------------------------- | -------------------------------------- |
| `npm run start:dev`                       | Run in development mode (watch)        |
| `npm run start:debug`                     | Run in debug mode (watch)              |
| `npm run build`                           | Build for production                   |
| `npm run test`                            | Run unit tests                         |
| `npm run test:watch`                      | Run tests in watch mode                |
| `npm run test:e2e`                        | Run end-to-end tests                   |
| `npm run test:cov`                        | Run tests with coverage                |
| `npm run prisma:generate-schema`          | Generate Prisma client                 |
| `npm run prisma:migration:new`            | Create and apply new migration         |
| `npm run prisma:migration:new:create-only`| Create migration without applying      |
| `npm run migrate`                         | Apply migrations (production)          |
| `npm run prisma:reset-database`           | Reset database (destructive)           |
| `npm run better-auth:generate`            | Generate Better Auth client            |

### Web (`apps/web`)

| Command               | Description              |
| --------------------- | ------------------------ |
| `npm run dev`         | Run Vite dev server      |
| `npm run build`       | Build for production     |
| `npm run preview`     | Preview production build |
| `npm run check-types` | Type check only          |

### Shared (`packages/shared`)

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run build` | Build with tsup        |
| `npm run dev`   | Build in watch mode    |

## Environment Variables

Configure in `apps/api/.env` (see `.env.example`):

| Variable                    | Description                              |
| --------------------------- | ---------------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection string             |
| `BETTER_AUTH_SECRET`        | Auth encryption secret                   |
| `BETTER_AUTH_URL`           | Auth server URL                          |
| `TRUSTED_ORIGINS`           | Allowed frontend origins (comma-separated) |
| `APP_DISPLAY_NAME`          | Application display name                 |
| `APP_DOMAIN`                | Application domain                       |
| `ENVIRONMENT`               | `local` \| `development` \| `production` |
| `REDIS_HOST`, `REDIS_PORT`  | Redis for BullMQ                         |
| `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT` | SMTP configuration              |
| `RESEND_API_KEY`            | Resend email service                     |
| `BETTER_STACK_SOURCE_TOKEN`, `BETTER_STACK_ENDPOINT` | Logging        |
| `SENTRY_DSN`                | Error tracking                           |

## Database Changes

1. Update `apps/api/src/infrastructure/database/prisma/schema.prisma`
2. `npm run prisma:migration:new:create-only` — generate migration SQL
3. Review the generated SQL in `prisma/migrations/`
4. `npm run prisma:migration:new` — apply the migration
5. Update mappers and entities as needed

## Better Auth Changes

When modifying the Better Auth configuration:

1. `npm run better-auth:generate` — regenerate the client
2. Copy the generated schema to `schema.prisma`
3. `npm run prisma:generate-schema`
4. `npm run prisma:migration:new`

## Testing

- Unit tests: `*.spec.ts` files alongside source
- E2E tests: `*.e2e-spec.ts` in `apps/api/test/`
- Run a single test file: `npm test -- path/to/file.spec.ts`
- Coverage: `npm run test:cov`
