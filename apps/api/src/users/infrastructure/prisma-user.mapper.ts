import { UserRole } from '@club-social/shared/users';
import { UserStatus } from '@club-social/shared/users';
import { Injectable } from '@nestjs/common';

import { UserModel } from '@/infrastructure/database/prisma/generated/models';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class PrismaUserMapper {
  public toDomain(user: UserModel): UserEntity {
    return UserEntity.fromPersistence(
      {
        banExpires: user.banExpires,
        banned: user.banned,
        banReason: user.banReason,
        email: Email.raw({ value: user.email }),
        firstName: user.firstName,
        lastName: user.lastName,
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
}
