import { singleton } from 'tsyringe';

import { MemberModel } from '@domain/members/models/member.model';
import { Mapper } from '@infra/mappers/mapper';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';

@singleton()
export class MemberMapper extends Mapper<MemberModel, MemberEntity> {
  public toModel(orm: MemberEntity): MemberModel {
    return new MemberModel({
      _id: orm._id,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      isDeleted: orm.isDeleted,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
      userId: orm.userId,
    });
  }

  protected getEntity(model: MemberModel): MemberEntity {
    return new MemberEntity({
      _id: model._id,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      isDeleted: model.isDeleted,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      userId: model.userId,
    });
  }
}
