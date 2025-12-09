import { UserRole } from '@club-social/types/users';
import { Injectable } from '@nestjs/common';

import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/domain/users/user.entity';
import { UserModel } from '@/infrastructure/prisma/generated/models';

import { Mapper } from './mapper';

@Injectable()
export class PrismaUserMapper extends Mapper<UserEntity, UserModel> {
  public toDomain(user: UserModel): UserEntity {
    return UserEntity.raw(
      {
        email: Email.raw({ value: user.email }),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRole,
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
      banExpires: null,
      banned: false,
      banReason: null,
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
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
}
