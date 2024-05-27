import { singleton } from 'tsyringe';

import { Mapper } from './mapper';

import { UserModel } from '@domain/users/models/user.model';
import { UserEntity } from '@infra/mongo/entities/users/user.entity';

@singleton()
export class UserMapper extends Mapper<UserModel, UserEntity> {
  public toModel(orm: UserEntity): UserModel {
    return new UserModel({
      _id: orm._id,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      firstName: orm.firstName,
      isDeleted: orm.isDeleted,
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
      firstName: model.firstName,
      isDeleted: model.isDeleted,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
    });
  }
}
