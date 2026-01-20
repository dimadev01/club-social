import { Module } from '@nestjs/common';

import { CreateUserUseCase } from './application/create-user.use-case';
import { UpdateUserNotificationPreferencesUseCase } from './application/update-user-notification-preferences.use-case';
import { UpdateUserPreferencesUseCase } from './application/update-user-preferences.use-case';
import { UpdateUserUseCase } from './application/update-user.use-case';
import { UsersController } from './presentation/user.controller';

@Module({
  controllers: [UsersController],

  providers: [
    CreateUserUseCase,
    UpdateUserNotificationPreferencesUseCase,
    UpdateUserPreferencesUseCase,
    UpdateUserUseCase,
  ],
})
export class UsersModule {}
