import { singleton } from 'tsyringe';

import { MemberAddressModel } from '@domain/members/models/member-address.model';
import { MemberModel } from '@domain/members/models/member.model';
import { Mapper } from '@infra/mappers/mapper';
import { MemberAddressEntity } from '@infra/mongo/entities/members/member-address.entity';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';

@singleton()
export class MemberMapper extends Mapper<MemberModel, MemberEntity> {
  public toModel(orm: MemberEntity): MemberModel {
    return new MemberModel({
      _id: orm._id,
      address: new MemberAddressModel({
        cityGovId: orm.address.cityGovId,
        cityName: orm.address.cityName,
        stateGovId: orm.address.stateGovId,
        stateName: orm.address.stateName,
        street: orm.address.street,
        zipCode: orm.address.zipCode,
      }),
      category: orm.category,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      dateOfBirth: orm.dateOfBirth,
      deletedAt: orm.deletedAt,
      deletedBy: orm.deletedBy,
      documentID: orm.documentID,
      fileStatus: orm.fileStatus,
      isDeleted: orm.isDeleted,
      maritalStatus: orm.maritalStatus,
      nationality: orm.nationality,
      phones: orm.phones,
      sex: orm.sex,
      status: orm.status,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
      user: null,
      userId: orm.userId,
    });
  }

  protected getEntity(model: MemberModel): MemberEntity {
    return new MemberEntity({
      _id: model._id,
      address: new MemberAddressEntity({
        cityGovId: model.address.cityGovId,
        cityName: model.address.cityName,
        stateGovId: model.address.stateGovId,
        stateName: model.address.stateName,
        street: model.address.street,
        zipCode: model.address.zipCode,
      }),
      category: model.category,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      dateOfBirth: model.dateOfBirth,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
      documentID: model.documentID,
      fileStatus: model.fileStatus,
      isDeleted: model.isDeleted,
      maritalStatus: model.maritalStatus,
      nationality: model.nationality,
      phones: model.phones,
      sex: model.sex,
      status: model.status,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      userId: model.userId,
    });
  }
}
