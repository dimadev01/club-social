import { Module } from '@nestjs/common';

import { UserCreatedHandler } from '@/infrastructure/events/user-created.handler';
import { UserUpdatedHandler } from '@/infrastructure/events/user-updated.handler';

import { CreateUserUseCase } from './application/create-user/create-user.use-case';
import { UpdateUserUseCase } from './application/update-user/update-user.use-case';
import { USER_REPOSITORY_PROVIDER } from './domain/user.repository';
import { PrismaUserMapper } from './infrastructure/prisma-user.mapper';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { UsersController } from './presentation/user.controller';

@Module({
  controllers: [UsersController],
  exports: [USER_REPOSITORY_PROVIDER],
  imports: [],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    {
      provide: USER_REPOSITORY_PROVIDER,
      useClass: PrismaUserRepository,
    },
    PrismaUserMapper,
    UserCreatedHandler,
    UserUpdatedHandler,
  ],
})
export class UsersModule {}
