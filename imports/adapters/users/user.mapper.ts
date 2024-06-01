import { singleton } from 'tsyringe';

import { Mapper } from '../common/mappers/mapper';

import { UserEmailEntity } from '@adapters/mongo/entities/user-email.entity';
import { UserProfileEntity } from '@adapters/mongo/entities/user-profile.entity';
import { UserEntity } from '@adapters/mongo/entities/user.entity';
import { UserEmailModel } from '@domain/users/models/user-email.model';
import { UserModel } from '@domain/users/models/user.model';

@singleton()
export class UserMapper extends Mapper<UserModel, UserEntity> {
  public toModel(orm: UserEntity): UserModel {
    return new UserModel({
      _id: orm._id,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      emails:
        orm.emails?.map(
          (email) =>
            new UserEmailModel({
              address: email.address,
              verified: email.verified,
            }),
        ) ?? null,
      firstName: orm.profile.firstName,
      heartbeat: orm.heartbeat,
      isDeleted: orm.isDeleted,
      lastName: orm.profile.lastName,
      role: orm.profile.role,
      services: orm.services,
      state: orm.profile.state,
      theme: orm.profile.theme,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
    });
  }

  protected getEntity(model: UserModel): UserEntity {
    return new UserEntity({
      _id: model._id,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      emails:
        model.emails?.map(
          (email) =>
            new UserEmailEntity({
              address: email.address,
              verified: email.verified,
            }),
        ) ?? null,
      heartbeat: model.heartbeat,
      isDeleted: model.isDeleted,
      profile: new UserProfileEntity({
        firstName: model.firstName,
        lastName: model.lastName,
        role: model.role,
        state: model.state,
        theme: model.theme,
      }),
      services: model.services,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
    });
  }
}
