# Club Social

A monorepo for managing club membership, dues, payments, and financial tracking.

## Tech Stack

- **Monorepo**: Turborepo with npm workspaces
- **Backend**: NestJS with Domain-Driven Design architecture
- **Frontend**: React 19 + Vite + Ant Design + TanStack Query
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth with passkey support

## Project Structure

```
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # React frontend
├── packages/
│   ├── shared/       # Shared TypeScript types and enums
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
   - Copy `.env.example` to `.env` in `apps/api`
   - Configure your database connection, auth secrets, etc.

3. **Generate Prisma client**

   ```bash
   cd apps/api
   npm run generate-schema
   ```

4. **Run database migrations**

   ```bash
   cd apps/api
   npm run new-migration
   ```

5. **Start development servers**

   ```bash
   # From root - runs all apps
   npm run build  # Build shared packages first

   # Then in separate terminals:
   cd apps/api && npm run start:dev
   cd apps/web && npm run dev
   ```

## Common Commands

| Command               | Description                           |
| --------------------- | ------------------------------------- |
| `npm run build`       | Build all apps and packages           |
| `npm run check`       | Run type checking, tests, and linting |
| `npm run check-types` | Type check all workspaces             |
| `npm run lint`        | Lint all workspaces                   |
| `npm run format`      | Format all workspaces                 |
| `npm test`            | Run tests across all workspaces       |

## Better Auth

When making changes to the Better Auth configuration:

1. Run `npm run better-auth:generate` in `apps/api`
2. Copy the generated schema to `src/infrastructure/database/prisma/schema.prisma`
3. Run `npm run generate-schema`
4. Run `npm run new-migration`

## Test Coverage

### API

[![codecov](https://codecov.io/gh/dimadev01/club-social/branch/main/graph/badge.svg?token=A5C3NJ0JPC)](https://codecov.io/gh/dimadev01/club-social)
