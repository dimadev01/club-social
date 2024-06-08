import { injectable } from 'tsyringe';

import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import { Member } from '@domain/members/models/member.model';
import { Mapper } from '@infra/mongo/common/mappers/mapper';
import { MemberAddressEntity } from '@infra/mongo/entities/member-address.entity';
import { MemberEntity } from '@infra/mongo/entities/member.entity';
import { UserMapper } from '@infra/mongo/mappers/user.mapper';

@injectable()
export class MemberMapper extends Mapper<Member, MemberEntity> {
  public constructor(private readonly _userMapper: UserMapper) {
    super();
  }

  public toDomain(orm: MemberEntity): Member {
    return new Member(
      {
        _id: orm._id,
        address: {
          cityGovId: orm.address.cityGovId,
          cityName: orm.address.cityName,
          stateGovId: orm.address.stateGovId,
          stateName: orm.address.stateName,
          street: orm.address.street,
          zipCode: orm.address.zipCode,
        },
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
        userId: orm.userId,
      },
      orm.user ? this._userMapper.toDomain(orm.user) : undefined,
    );
  }

  protected getEntity(model: Member): MemberEntity {
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
      userId: model.userId,
    });
  }
}
