import { injectable } from 'tsyringe';

import { BirthDate } from '@domain/common/value-objects/birth-date.value-object';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
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

  public toDomain(entity: MemberEntity): Member {
    return new Member(
      {
        _id: entity._id,
        address: {
          cityGovId: entity.address.cityGovId,
          cityName: entity.address.cityName,
          stateGovId: entity.address.stateGovId,
          stateName: entity.address.stateName,
          street: entity.address.street,
          zipCode: entity.address.zipCode,
        },
        birthDate: entity.birthDate ? new BirthDate(entity.birthDate) : null,
        category: entity.category,
        createdAt: new DateTimeVo(entity.createdAt),
        createdBy: entity.createdBy,
        deletedAt: entity.deletedAt ? new DateTimeVo(entity.deletedAt) : null,
        deletedBy: entity.deletedBy,
        documentID: entity.documentID,
        fileStatus: entity.fileStatus,
        firstName: entity.firstName,
        isDeleted: entity.isDeleted,
        lastName: entity.lastName,
        maritalStatus: entity.maritalStatus,
        nationality: entity.nationality,
        phones: entity.phones,
        sex: entity.sex,
        status: entity.status,
        updatedAt: new DateTimeVo(entity.updatedAt),
        updatedBy: entity.updatedBy,
        userId: entity.userId,
      },
      entity.user ? this._userMapper.toDomain(entity.user) : undefined,
    );
  }

  protected getEntity(domain: Member): MemberEntity {
    return new MemberEntity({
      _id: domain._id,
      address: new MemberAddressEntity({
        cityGovId: domain.address.cityGovId,
        cityName: domain.address.cityName,
        stateGovId: domain.address.stateGovId,
        stateName: domain.address.stateName,
        street: domain.address.street,
        zipCode: domain.address.zipCode,
      }),
      birthDate: domain.birthDate?.date ?? null,
      category: domain.category,
      createdAt: domain.createdAt.date,
      createdBy: domain.createdBy,
      deletedAt: domain.deletedAt?.date ?? null,
      deletedBy: domain.deletedBy,
      documentID: domain.documentID,
      fileStatus: domain.fileStatus,
      firstName: domain.firstName,
      isDeleted: domain.isDeleted,
      lastName: domain.lastName,
      maritalStatus: domain.maritalStatus,
      nationality: domain.nationality,
      phones: domain.phones,
      sex: domain.sex,
      status: domain.status,
      updatedAt: domain.updatedAt.date,
      updatedBy: domain.updatedBy,
      userId: domain.userId,
    });
  }
}
