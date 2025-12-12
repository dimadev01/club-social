import { Module } from '@nestjs/common';

import { CreateUserUseCase } from '@/application/users/create-user/create-user.use-case';
import { UpdateUserUseCase } from '@/application/users/update-user/update-user.use-case';
import { USER_REPOSITORY_PROVIDER } from '@/domain/users/user.repository';
import { PrismaUserMapper } from '@/infrastructure/repositories/users/prisma-user.mapper';
import { PrismaUserRepository } from '@/infrastructure/repositories/users/prisma-user.repository';

import { UsersController } from './user.controller';

@Module({
  controllers: [UsersController],
  exports: [USER_REPOSITORY_PROVIDER],
  imports: [],
  providers: [
    PrismaUserMapper,
    CreateUserUseCase,
    UpdateUserUseCase,
    {
      provide: USER_REPOSITORY_PROVIDER,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UsersModule {}
