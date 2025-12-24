import { Module } from '@nestjs/common';

import { CreateUserUseCase } from './application/create-user/create-user.use-case';
import { UpdateUserUseCase } from './application/update-user/update-user.use-case';
import {
  USER_READABLE_REPOSITORY_PROVIDER,
  USER_REPOSITORY_PROVIDER,
  USER_WRITEABLE_REPOSITORY_PROVIDER,
} from './domain/user.repository';
import { BetterAuthUserRepository } from './infrastructure/better-auth-user.repository';
import { CompositeUserRepository } from './infrastructure/composite-user.repository';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { UsersController } from './presentation/user.controller';

@Module({
  controllers: [UsersController],
  exports: [
    USER_READABLE_REPOSITORY_PROVIDER,
    USER_REPOSITORY_PROVIDER,
    CreateUserUseCase,
  ],
  imports: [],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    {
      provide: USER_READABLE_REPOSITORY_PROVIDER,
      useClass: PrismaUserRepository,
    },
    {
      provide: USER_WRITEABLE_REPOSITORY_PROVIDER,
      useClass: BetterAuthUserRepository,
    },
    {
      provide: USER_REPOSITORY_PROVIDER,
      useClass: CompositeUserRepository,
    },
  ],
})
export class UsersModule {}
