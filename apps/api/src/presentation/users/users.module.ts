import { Module } from '@nestjs/common';

import { CreateUserUseCase } from '@/application/users/create-user/create-user.use-case';
import { USERS_REPOSITORY_PROVIDER } from '@/domain/users/user.repository';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { PrismaUserRepository } from '@/infrastructure/repositories/users/prisma-user.repository';
import { SupabaseRepository } from '@/infrastructure/supabase/supabase.repository';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [DatabaseModule],
  providers: [
    CreateUserUseCase,
    UsersService,
    SupabaseRepository,
    {
      provide: USERS_REPOSITORY_PROVIDER,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UsersModule {}
