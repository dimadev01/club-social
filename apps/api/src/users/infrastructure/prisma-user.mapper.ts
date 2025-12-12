import { UserRole } from '@club-social/shared/users';
import { UserStatus } from '@club-social/shared/users';
import { Injectable } from '@nestjs/common';

import { UserModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class PrismaUserMapper extends Mapper<UserEntity, UserModel> {
  public toDomain(user: UserModel): UserEntity {
    return UserEntity.fromPersistence(
      {
        banExpires: user.banExpires,
        banned: user.banned,
        banReason: user.banReason,
        createdBy: user.createdBy,
        email: Email.raw({ value: user.email }),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRole,
        status: user.status as UserStatus,
      },
      {
        createdAt: user.createdAt,
        createdBy: user.createdBy,
        deletedAt: user.deletedAt,
        deletedBy: user.deletedBy,
        id: UniqueId.raw({ value: user.id }),
        updatedAt: user.updatedAt,
        updatedBy: user.updatedBy,
      },
    );
  }

  public toPersistence(user: UserEntity): UserModel {
    return {
      banExpires: user.banExpires,
      banned: user.banned,
      banReason: user.banReason,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      deletedAt: user.deletedAt,
      deletedBy: user.deletedBy,
      email: user.email.value,
      emailVerified: false,
      firstName: user.firstName,
      id: user.id.value,
      image: null,
      lastName: user.lastName,
      name: user.name,
      role: user.role as UserRole,
      status: user.status,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
}
