# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Club Social is a monorepo built with Turborepo containing:

- **apps/api**: NestJS backend API following Domain-Driven Design (DDD) principles
- **apps/web**: React frontend with Vite, React Router, TanStack Query, and Ant Design
- **packages/shared**: Shared TypeScript types and enums for cross-app consistency
- **packages/eslint-config**: Shared ESLint configuration
- **packages/prettier-config**: Shared Prettier configuration

## Development Commands

### Root-level commands

```bash
npm run build              # Build all apps and packages (via Turbo)
npm run check              # Run type checking, tests, linting, and formatting
npm run check-types        # Type check all workspaces
npm run lint               # Lint all workspaces
npm run format             # Format all workspaces
npm run ncu                # Interactively update dependencies
```

### API-specific commands (from apps/api)

```bash
npm run start:dev          # Run API in development mode with watch
npm run start:debug        # Run API in debug mode with watch
npm run start:prod         # Run production build
npm run build              # Build the API
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Prisma commands (all use dotenvx for env loading)
npm run prisma:generate    # Generate Prisma client
npm run prisma:new         # Create and apply new migration
npm run prisma:new:create-only  # Create migration without applying
npm run prisma:migrate     # Apply migrations (production)
npm run prisma:reset       # Reset database (destructive)

# Better Auth
npm run better-auth:generate  # Generate Better Auth client
```

### Web-specific commands (from apps/web)

```bash
npm run dev                # Run Vite dev server
npm run build              # Build for production
npm run preview            # Preview production build
npm run check-types        # Type check only
```

### Shared package commands (from packages/shared)

```bash
npm run build              # Build shared package with tsup
npm run dev                # Build in watch mode
```

## Architecture

### Backend (apps/api) - Domain-Driven Design

The API follows a strict DDD architecture with clear separation of concerns.

#### Domain Modules

Each domain module follows this structure:

```
module/
├── application/           # Application layer - use cases and orchestration
│   ├── create-X/
│   │   ├── create-X.use-case.ts
│   │   └── create-X.params.ts
│   └── update-X/
├── domain/                # Domain layer - business logic and rules
│   ├── entities/
│   │   └── X.entity.ts
│   ├── events/
│   │   └── X-created.event.ts
│   ├── interfaces/
│   │   └── X.interface.ts
│   └── X.repository.ts
├── infrastructure/        # Infrastructure layer - technical implementations
│   ├── prisma-X.mapper.ts
│   └── prisma-X.repository.ts
└── presentation/          # Presentation layer - HTTP/API concerns
    ├── dto/
    │   ├── create-X.dto.ts
    │   ├── update-X.dto.ts
    │   └── X.dto.ts
    └── X.controller.ts
```

Current domain modules:
- `members/` - Member management (includes `ledger/` subdomain for financial ledger)
- `users/` - User management and authentication
- `payments/` - Payment processing
- `dues/` - Membership dues
- `movements/` - Financial movements with status tracking
- `pricing/` - Pricing configuration
- `audit/` - Audit logging

#### Key Architectural Patterns

**1. Result Pattern**: All operations return `Result<T, E>` from neverthrow library

```typescript
import { ok, err, Result } from '@/shared/domain/result';

// Success: ok(value)
// Failure: err(error)
// Check: .isOk() / .isErr()
```

**2. Entity Hierarchy**: Three-level class hierarchy for domain entities

```
Entity                    # Base class with UniqueId
  └── AggregateRoot       # Adds domain event management (addEvent, pullEvents)
        └── AuditedAggregateRoot  # Adds audit fields (createdAt/By, updatedAt/By)
```

- Factory methods: `create()` for new entities, `fromPersistence()` for hydration
- Audited entities have `markAsUpdated(updatedBy: string)` method

**3. Value Objects**: Immutable domain concepts with validation

Located in `shared/domain/value-objects/`:
- `UniqueId` - Entity identifiers (auto-generates UUIDs)
- `Email` - Validated email addresses
- `Name` - Personal names
- `Address` - Physical addresses
- `DateOnly` - Date without time
- `DateRange` - Start/end date pairs
- `Amount` - Non-negative monetary values
- `SignedAmount` - Positive or negative monetary values (for ledger entries)

All use factory pattern:
- `raw()` - Skip validation (for hydration from persistence)
- `create()` - Validate and return `Result<ValueObject>`

**4. Use Cases**: Application layer orchestration

```typescript
export abstract class UseCase<TResponse, TError extends Error> {
  protected constructor(protected readonly logger: AppLogger) {
    this.logger.setContext(this.constructor.name);
  }

  abstract execute(request?: unknown): Promise<Result<TResponse, TError>>;
}
```

**5. Repository Pattern**: Abstraction over data access

Base interfaces in `shared/domain/repository.ts`:
- `ReadableRepository<T>` - findById, findByIdOrThrow, findByIds
- `WriteableRepository<T>` - save(entity, tx?)
- `PaginatedRepository<TData, TSummary>` - findPaginated

Repositories also commonly implement:
- `findByIdReadModel()` - Returns read model (DTO) for queries
- `findPaginated()` - Returns read models with optional summary
- Custom query methods returning read models

**6. Unit of Work Pattern**: Atomic transactions across repositories

```typescript
interface UnitOfWork {
  execute<T>(fn: (repos: TransactionalRepositories) => Promise<T>): Promise<T>;
}

// Available repositories in transaction:
interface TransactionalRepositories {
  dues: WriteableRepository<DueEntity>;
  memberLedger: WriteableRepository<MemberLedgerEntryEntity>;
  payments: WriteableRepository<PaymentEntity>;
}

// Inject via UNIT_OF_WORK_PROVIDER symbol
```

**7. Mappers**: Convert between domain and persistence models

Located in `infrastructure/`:
- `toDomain()` - Prisma model → Domain entity (uses `raw()` for value objects)
- `toCreateInput()` - Domain entity → Prisma create input
- `toUpdateInput()` - Domain entity → Prisma update input

**8. Domain Events**: Events dispatched after persistence

- Events defined in `domain/events/`
- Handlers in `infrastructure/events/` use `@OnEvent()` decorator
- Pattern: Save entity → `eventPublisher.dispatch(entity)` → handlers execute

**9. Error Handling**: Structured error classes

Located in `shared/domain/errors/`:
- `ApplicationError` - Base error class
- `ConflictError` - Constraint violations
- `EntityNotFoundError` - Entity not found
- `InternalServerError` - Unexpected errors
- `ErrorMapper` - Maps errors to HTTP responses

#### Infrastructure Layer

**Database**: Prisma with PostgreSQL
- Schema: `src/infrastructure/database/prisma/schema.prisma`
- Config: `src/infrastructure/database/prisma/prisma.config.ts`
- Generated client: `src/infrastructure/database/prisma/generated/`
- Unit of Work: `src/infrastructure/database/prisma/prisma-unit-of-work.ts`

**Auth**: Better Auth with passkey support
- Service: `src/infrastructure/auth/better-auth/`
- Env: `BETTER_AUTH_SECRET`, `BETTER_AUTH_TRUSTED_ORIGINS`

**Config**: Type-safe configuration with `@itgorillaz/configify`
- Service: `src/infrastructure/config/config.service.ts`
- Validates at startup, helper methods: `isDev`, `isLocal`, `isProd`

**Logging**: Winston + Better Stack (Logtail)
- Inject via `APP_LOGGER_PROVIDER` symbol
- Interface: `error(log)`, `info(log)`, `warn(log)`, `setContext(context)`

**Queue**: BullMQ for background jobs
- Location: `src/infrastructure/queue/`
- Requires: `REDIS_HOST`, `REDIS_PORT`

**Email**: Multiple providers
- Resend and Nodemailer support
- Queue-based: `EmailQueueService`, `EmailProcessor`

**CSV**: Data export/import
- Service: `src/infrastructure/csv/`

**Trace**: Request tracing
- Middleware and service for trace ID management

**Storage**: ClsService (nestjs-cls) for request-scoped data

**Observability**: Sentry integration
- Error tracking and performance monitoring
- Source maps via `npm run sentry:sourcemaps`

### Frontend (apps/web)

Built with React 19, React Router 7, and TanStack Query.

#### Structure

```
src/
├── app/                   # App shell, context, theme, routing
├── shared/                # Shared utilities and API client
├── ui/                    # Reusable UI components
├── auth/                  # Authentication
├── members/               # Member management
├── member-ledger/         # Member financial ledger
├── payments/              # Payments
├── dues/                  # Membership dues
├── movements/             # Financial movements
├── pricing/               # Pricing configuration
├── audit-logs/            # Audit log viewer
├── profile/               # User profile
└── home/                  # Dashboard
```

#### Key Patterns

- **Routing**: React Router with file-based routing
- **Server State**: TanStack Query with `@lukemorales/query-key-factory`
- **UI Framework**: Ant Design v6 components
- **Styling**: Tailwind CSS v4 with `clsx` and `tailwind-merge`
- **Theme**: AppContext with theme/mode management, localStorage persistence
- **Date Handling**: dayjs with plugins and Spanish locale
- **Auth**: Better Auth client with passkey support

### Shared Package

The `packages/shared` package provides types shared between API and web.

#### Exports (conditional exports pattern)

```typescript
import { ... } from '@club-social/shared/members';
import { ... } from '@club-social/shared/users';
import { ... } from '@club-social/shared/dues';
import { ... } from '@club-social/shared/payments';
import { ... } from '@club-social/shared/movements';
import { ... } from '@club-social/shared/pricing';
import { ... } from '@club-social/shared/audit-logs';
import { ... } from '@club-social/shared/roles';
import { ... } from '@club-social/shared/types';
import { ... } from '@club-social/shared/lib';
```

Built with tsup for dual CJS/ESM output. Must be built before dependent packages.

## Important Patterns and Conventions

### Creating New Domain Modules

1. **Domain Layer First**:
   - Define entity extending `AuditedAggregateRoot`
   - Create repository interface composing base interfaces
   - Add domain events if needed
   - Define value objects for domain concepts

2. **Application Layer**:
   - Create use case extending `UseCase<TResponse, TError>`
   - Define params interface for input
   - Inject repository via provider symbol
   - Return `Result<T>` for all operations

3. **Infrastructure Layer**:
   - Implement mapper with `toDomain()`, `toCreateInput()`, `toUpdateInput()`
   - Implement repository
   - Register in module providers
   - Add event handlers if needed

4. **Presentation Layer**:
   - Create DTOs with `class-validator` decorators
   - Implement controller with Swagger decorators
   - Handle Result unwrapping and error responses

### Module Exports

Modules export specific use cases for cross-module use:
```typescript
@Module({
  exports: [CreateMemberUseCase],
})
export class MembersModule {}
```

### Database Changes

1. Update `schema.prisma`
2. Run `npm run prisma:new:create-only` to generate migration
3. Review generated SQL in `prisma/migrations/`
4. Apply with `npm run prisma:new`
5. Update mappers and entities

### Shared Types

1. Add to appropriate domain in `packages/shared/src/`
2. Export from domain's `index.ts`
3. Run `npm run build` in `packages/shared`
4. Import: `@club-social/shared/domain-name`

## Environment Variables

Critical variables (see `.env.example` files):

- `DATABASE_URI`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Auth encryption secret
- `BETTER_AUTH_TRUSTED_ORIGINS`: Allowed frontend origins (comma-separated)
- `ADMIN_USER_EMAIL`: Admin user email
- `APP_DISPLAY_NAME`: Application display name
- `APP_DOMAIN`: Application domain
- `ENVIRONMENT`: local | development | production
- `REDIS_HOST`, `REDIS_PORT`: Redis for BullMQ
- `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`: SMTP configuration
- `RESEND_API_KEY`: Resend email service
- `BETTER_STACK_SOURCE_TOKEN`, `BETTER_STACK_ENDPOINT`: Logging
- `SENTRY_DSN`: Error tracking

## Testing

- Unit tests: `*.spec.ts` files alongside source
- E2E tests: `*.e2e-spec.ts` in `apps/api/test/`
- Run single test: `npm test -- path/to/file.spec.ts`
- Coverage: `npm run test:cov`
