import { UserRole } from '@club-social/shared/users';
import { UserStatus } from '@club-social/shared/users';
import { Injectable } from '@nestjs/common';

import { UserModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from '../domain/entities/member.entity';

@Injectable()
export class PrismaMemberMapper extends Mapper<MemberEntity, UserModel> {
  public toDomain(user: UserModel): MemberEntity {
    return MemberEntity.fromPersistence(
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

  public toPersistence(member: MemberEntity): UserModel {
    return {
      banExpires: member.banExpires,
      banned: member.banned,
      banReason: member.banReason,
      createdAt: member.createdAt,
      createdBy: member.createdBy,
      deletedAt: member.deletedAt,
      deletedBy: member.deletedBy,
      email: member.email.value,
      emailVerified: false,
      firstName: member.firstName,
      id: member.id.value,
      image: null,
      lastName: member.lastName,
      name: member.name,
      role: member.role as UserRole,
      status: member.status,
      updatedAt: member.updatedAt,
      updatedBy: member.updatedBy,
    };
  }
}
