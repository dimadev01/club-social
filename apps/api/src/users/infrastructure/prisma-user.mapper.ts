import { UserRole, UserStatus } from '@club-social/shared/users';
import { Injectable } from '@nestjs/common';
import { InputJsonValue, JsonNullClass } from '@prisma/client/runtime/client';

import {
  UserCreateInput,
  UserModel,
  UserUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  UserNotification,
  UserNotificationProps,
} from '../domain/entities/user-notification';
import {
  UserPreferences,
  UserPreferencesProps,
} from '../domain/entities/user-preferences';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class PrismaUserMapper {
  public toCreateInput(user: UserEntity): UserCreateInput {
    Guard.string(user.createdBy);

    return {
      createdBy: user.createdBy,
      deletedAt: user.deletedAt,
      deletedBy: user.deletedBy,
      email: user.email.value,
      emailVerified: false,
      firstName: user.name.firstName,
      id: user.id.value,
      lastName: user.name.lastName,
      name: user.name.fullNameFirstNameFirst,
      notificationPreferences:
        user.notificationPreferences.toJson() as unknown as
          | InputJsonValue
          | JsonNullClass,
      preferences: user.preferences.toJson() as unknown as
        | InputJsonValue
        | JsonNullClass,
      role: user.role,
      status: user.status,
    };
  }

  public toDomain(user: UserModel): UserEntity {
    return UserEntity.fromPersistence(
      {
        banExpires: user.banExpires,
        banned: user.banned,
        banReason: user.banReason,
        email: Email.raw({ value: user.email }),
        name: Name.raw({ firstName: user.firstName, lastName: user.lastName }),
        notificationPreferences: UserNotification.raw(
          user.notificationPreferences as unknown as UserNotificationProps,
        ),
        preferences: UserPreferences.raw(
          user.preferences as unknown as UserPreferencesProps,
        ),
        role: user.role as UserRole,
        status: user.status as UserStatus,
      },
      {
        audit: {
          createdAt: user.createdAt,
          createdBy: user.createdBy,
          updatedAt: user.updatedAt,
          updatedBy: user.updatedBy,
        },
        deleted: {
          deletedAt: user.deletedAt,
          deletedBy: user.deletedBy,
        },
        id: UniqueId.raw({ value: user.id }),
      },
    );
  }

  public toUpdateInput(user: UserEntity): UserUpdateInput {
    return {
      email: user.email.value,
      firstName: user.name.firstName,
      lastName: user.name.lastName,
      notificationPreferences:
        user.notificationPreferences.toJson() as unknown as
          | InputJsonValue
          | JsonNullClass,
      preferences: user.preferences.toJson() as unknown as
        | InputJsonValue
        | JsonNullClass,
      status: user.status,
      updatedBy: user.updatedBy,
    };
  }
}
