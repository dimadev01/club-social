import type { UserModel } from '@/infrastructure/prisma/generated/models';

import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/domain/users/user.entity';
import { UserRole } from '@/domain/users/user.enum';

export abstract class PrismaUserMapper {
  public static toDomain(record: UserModel): UserEntity {
    return UserEntity.raw(
      {
        authId: record.authId,
        email: Email.raw({ value: record.email }),
        firstName: record.firstName,
        lastName: record.lastName,
        role: record.role as UserRole,
      },
      {
        createdAt: record.createdAt,
        createdBy: record.createdBy,
        deletedAt: record.deletedAt,
        deletedBy: record.deletedBy,
        id: UniqueId.raw({ value: record.id }),
        isDeleted: record.isDeleted,
        updatedAt: record.updatedAt,
        updatedBy: record.updatedBy,
      },
    );
  }

  public static toPersistence(user: UserEntity): UserModel {
    return {
      authId: user.authId,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      deletedAt: user.deletedAt,
      deletedBy: user.deletedBy,
      email: user.email.value,
      firstName: user.firstName,
      id: user.id.value,
      isDeleted: user.isDeleted,
      lastName: user.lastName,
      role: user.role,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
}
