# CLAUDE.md

Guidance for Claude Code when working in this repository. See README.md for setup, commands, and environment variables.

## Architecture

### Backend (apps/api) — Domain-Driven Design

Each domain module follows this layer structure:

```
module/
├── application/           # Use cases and orchestration
│   └── create-X/
│       ├── create-X.use-case.ts
│       └── create-X.params.ts
├── domain/                # Business logic and rules
│   ├── entities/X.entity.ts
│   ├── events/X-created.event.ts
│   ├── interfaces/X.interface.ts
│   └── X.repository.ts
├── infrastructure/        # Technical implementations
│   ├── prisma-X.mapper.ts
│   └── prisma-X.repository.ts
└── presentation/          # HTTP/API concerns
    ├── dto/
    └── X.controller.ts
```

Domain modules: `members/` (includes `ledger/`), `users/`, `payments/`, `dues/`, `movements/`, `pricing/`, `audit/`, `notifications/`, `groups/`, `app-settings/`

#### Key Architectural Patterns

**1. Result Pattern** — all operations return `Result<T, E>` from neverthrow

```typescript
import { ok, err, Result } from '@/shared/domain/result';
// ok(value) | err(error) | .isOk() / .isErr()
```

**2. Entity Hierarchy**

```
Entity                    # Base class with UniqueId
  └── AggregateRoot       # Adds domain events (addEvent, pullEvents)
        └── AuditedAggregateRoot  # Adds createdAt/By, updatedAt/By
```

- Factory methods: `create()` for new entities, `fromPersistence()` for hydration
- `markAsUpdated(updatedBy: string)` on audited entities

**3. Value Objects** — immutable, validated domain concepts

Located in `shared/domain/value-objects/`: `UniqueId`, `Email`, `Name`, `Address`, `DateOnly`, `DateRange`, `Amount`, `SignedAmount`

- `raw()` — skip validation (persistence hydration only)
- `create()` — validate and return `Result<ValueObject>`

**4. Use Cases**

```typescript
export abstract class UseCase<TResponse, TError extends Error> {
  protected constructor(protected readonly logger: AppLogger) {
    this.logger.setContext(this.constructor.name);
  }
  abstract execute(request?: unknown): Promise<Result<TResponse, TError>>;
}
```

**5. Repository Pattern**

Base interfaces in `shared/domain/repository.ts`:
- `ReadableRepository<T>` — `findById`, `findByIdOrThrow`, `findByIds`
- `WriteableRepository<T>` — `save(entity, tx?)`
- `PaginatedRepository<TData, TSummary>` — `findPaginated`

Repositories also implement `findByIdReadModel()` (read model for queries) and custom query methods.

**6. Unit of Work** — atomic transactions across repositories

```typescript
interface UnitOfWork {
  execute<T>(fn: (repos: TransactionalRepositories) => Promise<T>): Promise<T>;
}
// Inject via UNIT_OF_WORK_PROVIDER symbol
```

**7. Mappers**

- `toDomain()` — Prisma model → Domain entity (use `raw()` for value objects)
- `toCreateInput()` — Domain entity → Prisma create input
- `toUpdateInput()` — Domain entity → Prisma update input

**8. Domain Events**

- Defined in `domain/events/`
- Handlers in `infrastructure/events/` use `@OnEvent()` decorator
- Pattern: save entity → `eventPublisher.dispatch(entity)` → handlers execute

**9. Error Classes** — in `shared/domain/errors/`

`ApplicationError` (base), `ConflictError`, `EntityNotFoundError`, `InternalServerError`, `ErrorMapper` (maps to HTTP)

#### Infrastructure

| Concern | Details |
| --- | --- |
| Database | Prisma + PostgreSQL. Schema: `src/infrastructure/database/prisma/schema.prisma` |
| Auth | Better Auth. Service: `src/infrastructure/auth/better-auth/` |
| Config | `@itgorillaz/configify`. Service: `src/infrastructure/config/config.service.ts`. Helpers: `isDev`, `isLocal`, `isProd` |
| Logging | Winston + Sentry. Inject via `APP_LOGGER_PROVIDER`. Methods: `error`, `info`, `warn`, `setContext` |
| Queue | BullMQ. Location: `src/infrastructure/queue/` |
| Email | Resend + Nodemailer. Queue-based: `EmailQueueService`, `EmailProcessor` |
| Tracing | Middleware + service for trace ID management |
| Storage | `ClsService` (nestjs-cls) for request-scoped data |

### Frontend (apps/web)

Key patterns:
- **Routing**: React Router with file-based routing
- **Server State**: TanStack Query with `@lukemorales/query-key-factory`
- **UI**: Ant Design v6
- **Styling**: Tailwind CSS v4 with `clsx` and `tailwind-merge`
- **Theme**: `AppContext` with theme/mode management, localStorage persistence
- **Date Handling**: dayjs with plugins and Spanish locale

### Shared Package

Conditional exports — import by domain:

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
import { ... } from '@club-social/shared/groups';
import { ... } from '@club-social/shared/notifications';
import { ... } from '@club-social/shared/app-settings';
```

Built with tsup. Must be built before dependent packages.

## Patterns and Conventions

### Creating New Domain Modules

1. **Domain first**: entity extending `AuditedAggregateRoot`, repository interface, domain events, value objects
2. **Application**: use case extending `UseCase<TResponse, TError>`, params interface, inject repo via provider symbol, return `Result<T>`
3. **Infrastructure**: mapper (`toDomain`, `toCreateInput`, `toUpdateInput`), repository, register in module, event handlers
4. **Presentation**: DTOs with `class-validator`, controller with Swagger decorators, unwrap Result, use `ErrorMapper`

### Module Exports

Export specific use cases for cross-module use:

```typescript
@Module({ exports: [CreateMemberUseCase] })
export class MembersModule {}
```

### Database Changes

1. Update `schema.prisma`
2. `npm run prisma:migration:new:create-only` — generate SQL
3. Review migration in `prisma/migrations/`
4. `npm run prisma:migration:new` — apply
5. Update mappers and entities

### Shared Types

1. Add to `packages/shared/src/<domain>/`
2. Export from domain's `index.ts`
3. `npm run build` in `packages/shared`
4. Import as `@club-social/shared/<domain>`

## Development Guidelines

### Architecture

- **Fix DDD properly, never work around it.** NestJS DI errors mean a module boundary is wrong — fix the architecture, don't patch around it.
- Respect layer boundaries: domain → application → infrastructure → presentation.
- Always verify module imports and DI configuration after changes.

### Task Completion

- Finish the full scope before moving on. Don't leave partial implementations.

### Concurrency & Performance

- Use `p-limit` for bulk operations.
- Prefer batch database operations over loops of individual saves.

### Error Handling

- Always return `Result<T, E>` from use cases — never throw.
- Use specific error classes (`ConflictError`, `EntityNotFoundError`), not generic errors.
- In controllers, use `ErrorMapper` to convert domain errors to HTTP responses.

### Value Objects

- `create()` for user input (validates), `raw()` only for hydration from persistence.
- Never bypass validation for external data.

### Repository Patterns

- Return read models (DTOs) for queries, domain entities for commands.
- `findByIdOrThrow` when entity must exist, `findById` when checking existence.

### Testing & Validation

- Run `npm run check-types` after TypeScript changes.
- Run `npm run test` after modifying use cases or domain logic.
