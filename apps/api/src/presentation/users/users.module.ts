import { Module } from '@nestjs/common';

import { USERS_REPOSITORY_PROVIDER } from '@/domain/users/user.repository';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { PrismaUsersRepository } from '@/infrastructure/repositories/users/prisma-users.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: USERS_REPOSITORY_PROVIDER,
      useClass: PrismaUsersRepository,
    },
  ],
})
export class UsersModule {}
