import { singleton } from 'tsyringe';

import { Mapper } from '@adapters/common/mappers/mapper';
import { UserMapper } from '@adapters/mappers/user.mapper';
import { MemberAddressEntity } from '@adapters/members/entities/member-address.entity';
import { MemberEntity } from '@adapters/members/entities/member.entity';
import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import { MemberAddressModel } from '@domain/members/models/member-address.model';
import { MemberModel } from '@domain/members/models/member.model';

@singleton()
export class MemberMapper extends Mapper<MemberModel, MemberEntity> {
  public constructor(private readonly _userMapper: UserMapper) {
    super();
  }

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
      birthDate: orm.birthDate ? new BirthDate(orm.birthDate) : null,
      category: orm.category,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
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
      user: orm.user ? this._userMapper.toModel(orm.user) : undefined,
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
      birthDate: model.birthDate?.toDate() ?? null,
      category: model.category,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
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
      user: undefined,
      userId: model.userId,
    });
  }
}
