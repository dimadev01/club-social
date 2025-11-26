import { Module } from '@nestjs/common';

import { CreateUserUseCase } from '@/application/users/create-user/create-user.use-case';
import { USERS_REPOSITORY_PROVIDER } from '@/domain/users/user.repository';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { SupabaseUsersRepository } from '@/infrastructure/repositories/users/supabase-users.repository';

import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [DatabaseModule],
  providers: [
    {
      provide: USERS_REPOSITORY_PROVIDER,
      // useClass: PrismaUsersRepository,
      useClass: SupabaseUsersRepository,
    },
    CreateUserUseCase,
  ],
})
export class UsersModule {}
