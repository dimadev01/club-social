import { injectable } from 'tsyringe';

import { User } from '@domain/users/models/user.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { UserEmailEntity } from '@infra/mongo/entities/user-email.entity';
import { UserProfileEntity } from '@infra/mongo/entities/user-profile.entity';
import { UserEntity } from '@infra/mongo/entities/user.entity';

@injectable()
export class UserMapper extends Mapper<User, UserEntity> {
  public toDomain(user: UserEntity): User {
    return new User({
      _id: user._id,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      deletedAt: user.deletedAt,
      deletedBy: user.deletedBy,
      emails:
        user.emails?.map((email) => ({
          address: email.address,
          verified: email.verified,
        })) ?? [],
      firstName: user.profile.firstName,
      heartbeat: user.heartbeat,
      isDeleted: user.isDeleted,
      lastName: user.profile.lastName,
      role: user.profile.role,
      services: user.services,
      state: user.profile.state,
      theme: user.profile.theme,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    });
  }

  protected getEntity(user: User): UserEntity {
    return new UserEntity({
      _id: user._id,
      createdAt: user.createdAt,
      createdBy: user.createdBy,
      deletedAt: user.deletedAt,
      deletedBy: user.deletedBy,
      emails:
        user.emails?.map(
          (email) =>
            new UserEmailEntity({
              address: email.address,
              verified: email.verified,
            }),
        ) ?? null,
      heartbeat: user.heartbeat,
      isDeleted: user.isDeleted,
      profile: new UserProfileEntity({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        state: user.state,
        theme: user.theme,
      }),
      services: user.services,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    });
  }
}
