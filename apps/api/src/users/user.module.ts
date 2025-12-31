import { Module } from '@nestjs/common';

import { CreateUserUseCase } from './application/create-user.use-case';
import { UpdateUserUseCase } from './application/update-user.use-case';
import { UsersController } from './presentation/user.controller';

@Module({
  controllers: [UsersController],
  exports: [CreateUserUseCase],
  imports: [],
  providers: [CreateUserUseCase, UpdateUserUseCase],
})
export class UsersModule {}
