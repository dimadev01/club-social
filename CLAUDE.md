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
npm run build              # Build all apps and packages
npm run check              # Run type checking, tests, linting, and formatting
npm run check-types        # Type check all workspaces
npm run lint               # Lint all workspaces
npm run format             # Format all workspaces
npm run ncu                # Interactively update dependencies
```

### API-specific commands (from apps/api)

```bash
npm run start:dev          # Run API in development mode with watch
npm run start:debug        # Run API in debug mode
npm run build              # Build the API
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Prisma commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:new         # Create and apply new migration
npm run prisma:new:create-only  # Create migration without applying
npm run prisma:migrate     # Apply migrations (production)
npm run prisma:reset       # Reset database (destructive)
npm run prisma:seed        # Seed database

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

The API follows a strict DDD architecture with clear separation of concerns:

#### Module Structure

Each domain module (e.g., `members/`, `users/`) follows this structure:

```
module/
├── application/           # Application layer - use cases and orchestration
│   ├── create-X/
│   │   ├── create-X.use-case.ts    # Business logic orchestration
│   │   └── create-X.params.ts      # Input parameters
│   └── update-X/
├── domain/                # Domain layer - business logic and rules
│   ├── entities/
│   │   └── X.entity.ts    # Rich domain entities with behavior
│   ├── events/
│   │   └── X-created.event.ts     # Domain events
│   ├── interfaces/
│   │   └── X.interface.ts
│   └── X.repository.ts    # Repository interface (port)
├── infrastructure/        # Infrastructure layer - technical implementations
│   ├── prisma-X.mapper.ts         # Maps between domain entities and Prisma models
│   └── prisma-X.repository.ts     # Repository implementation (adapter)
└── presentation/          # Presentation layer - HTTP/API concerns
    ├── dto/
    │   ├── create-X.dto.ts
    │   ├── update-X.dto.ts
    │   └── X.dto.ts
    └── X.controller.ts
```

#### Key Architectural Patterns

**1. Result Pattern**: All operations return `Result<T, E>` from neverthrow library using the file `apps/api/src/shared/domain/result.ts`

- Success: `ok(value)`
- Failure: `err(error)`
- Check results with `.isOk()` / `.isErr()`
- Enables type-safe error handling without exceptions

**2. Entity Pattern**: Domain entities extend `Entity<T>` base class

- Rich domain models with behavior, not anemic data containers
- Factory methods: `create()` for new entities, `fromPersistence()` for hydration
- Built-in audit fields: `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `deletedAt`, `deletedBy`
- Methods like `markAsUpdated()`, `delete()`, `restore()` for state changes
- Entities emit domain events via `addEvent()` (from `AggregateRoot`)

**3. Domain Events**: Events are dispatched after persistence

- Events defined in `domain/events/`
- Handlers in `infrastructure/events/` use `@OnEvent()` decorator
- Pattern: Save entity → `eventPublisher.dispatch(entity)` → handlers execute
- Example: `MemberCreatedEvent` triggers Better Auth user creation

**4. Value Objects**: Encapsulate domain concepts with validation

- Located in `shared/domain/value-objects/`
- Examples: `Email`, `UniqueId`, `Address`
- Immutable and self-validating
- Created via factory methods that return `Result<ValueObject>`

**5. Use Cases**: Application layer orchestrates domain logic

- Extend `UseCase<TResponse, TError>` base class
- Constructor injection for dependencies
- Single `execute()` method
- Coordinate between repositories, entities, and domain events

**6. Repository Pattern**: Abstraction over data access

- Interface in `domain/` (e.g., `MemberRepository`)
- Implementation in `infrastructure/` (e.g., `PrismaMemberRepository`)
- Composed of: `ReadableRepository`, `WriteableRepository`, `PaginatedRepository`
- Injected using symbols: `MEMBER_REPOSITORY_PROVIDER`

**7. Mappers**: Convert between domain and persistence models

- Located in `infrastructure/`
- `toDomain()`: Prisma model → Domain entity
- `toPersistence()`: Domain entity → Prisma model
- Handle type conversions, value object creation, nested mappings

#### Infrastructure Layer Details

**Auth**: Better Auth integration for authentication

- Service in `infrastructure/auth/better-auth/`
- Configuration: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_TRUSTED_ORIGINS`

**Database**: Prisma with PostgreSQL

- Schema: `infrastructure/database/prisma/schema.prisma`
- Generated client in `infrastructure/database/prisma/generated/`
- Use `dotenvx run --` prefix for all Prisma commands to load environment variables

**Config**: Type-safe configuration with `@itgorillaz/configify`

- Service in `infrastructure/config/config.service.ts`
- Validates environment variables at startup

**Logging**: Winston + Better Stack (Logtail)

- Inject via `APP_LOGGER_PROVIDER`
- Auto-context from class name in use cases
- Configuration: `BETTER_STACK_SOURCE_TOKEN`, `BETTER_STACK_ENDPOINT`

**Queue**: BullMQ for background jobs

- Located in `infrastructure/queue/`

**Events**: NestJS Event Emitter for domain events

- Event handlers in `infrastructure/events/`

**Storage**: ClsService for request-scoped storage

- Access request context (headers, user info) anywhere in the request lifecycle

**Observability**: Sentry for error tracking and performance monitoring

- Configuration: `SENTRY_DSN`
- Source maps uploaded via `npm run sentry:sourcemaps`

### Frontend (apps/web)

Built with React 19, React Router 7, and TanStack Query:

- **Routing**: React Router with file-based routing
- **State Management**: TanStack Query for server state
- **UI Framework**: Ant Design components
- **Styling**: Tailwind CSS v4 with `clsx` and `tailwind-merge` utilities
- **Auth**: Better Auth client integration
- **Type Safety**: Shared types from `@club-social/shared` package

### Shared Package

The `packages/shared` package contains:

- TypeScript types and enums shared between API and web
- Organized by domain: `roles/`, `users/`, `members/`
- Built with tsup for dual CJS/ESM output
- Must be built before dependent packages can run tests

## Important Patterns and Conventions

### Creating New Domain Modules

When adding a new domain module, follow the DDD structure:

1. **Domain Layer First**:
   - Define entity in `domain/entities/` extending `Entity<T>`
   - Create repository interface in `domain/` composing base repository interfaces
   - Add domain events in `domain/events/`
   - Define value objects if needed

2. **Application Layer**:
   - Create use case extending `UseCase<TResponse, TError>`
   - Define params interface for input validation
   - Inject repository via provider symbol
   - Return `Result<T>` for all operations

3. **Infrastructure Layer**:
   - Implement Prisma mapper with `toDomain()` and `toPersistence()`
   - Implement repository interface
   - Register in module providers
   - Create event handlers if needed

4. **Presentation Layer**:
   - Create DTOs with `class-validator` decorators
   - Implement controller with proper HTTP semantics
   - Document with Swagger decorators
   - Handle Result unwrapping and error responses

### Database Changes

1. Update `schema.prisma`
2. Run `npm run prisma:new:create-only` to generate migration
3. Review generated SQL in `prisma/migrations/`
4. Apply with `npm run prisma:new` or modify and then apply
5. Update mappers and entities accordingly

### Shared Types

When adding types used by both API and web:

1. Add to appropriate domain in `packages/shared/src/`
2. Export from domain's `index.ts`
3. Run `npm run build` in `packages/shared`
4. Import in API: `@club-social/shared/domain-name`
5. Import in web: `@club-social/shared/domain-name`

## Environment Variables

Critical environment variables (see `.env.example` files):

- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Auth encryption secret
- `BETTER_AUTH_URL`: Backend URL for auth callbacks
- `BETTER_AUTH_TRUSTED_ORIGINS`: Allowed frontend origins (CORS)
- `SENTRY_DSN`: Error tracking endpoint
- `BETTER_STACK_SOURCE_TOKEN`: Logging service token
- `RESEND_API_KEY`: Email service API key

## Testing

- Unit tests: `*.spec.ts` files alongside source
- E2E tests: `*.e2e-spec.ts` in `apps/api/test/`
- Test configuration in `jest` section of `package.json`
- Run single test file: `npm test -- path/to/file.spec.ts`
