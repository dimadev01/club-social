##

### Better Auth

When doing a change in the better-auth config, do:

1. `npm run better-auth:generated`
2. Copy the schema generated in `src/prisma/schema.prisma` to `src/infrastructure/database/prisma/schema.prisma`
3. `npm run prisma:generate`
4. `npm prisma:new`
