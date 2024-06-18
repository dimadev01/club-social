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

  public toDomain(member: MemberEntity): Member {
    return new Member(
      {
        _id: member._id,
        address: {
          cityGovId: member.address.cityGovId,
          cityName: member.address.cityName,
          stateGovId: member.address.stateGovId,
          stateName: member.address.stateName,
          street: member.address.street,
          zipCode: member.address.zipCode,
        },
        birthDate: member.birthDate ? new BirthDate(member.birthDate) : null,
        category: member.category,
        createdAt: new DateTimeVo(member.createdAt),
        createdBy: member.createdBy,
        deletedAt: member.deletedAt ? new DateTimeVo(member.deletedAt) : null,
        deletedBy: member.deletedBy,
        documentID: member.documentID,
        fileStatus: member.fileStatus,
        firstName: member.firstName,
        isDeleted: member.isDeleted,
        lastName: member.lastName,
        maritalStatus: member.maritalStatus,
        nationality: member.nationality,
        phones: member.phones,
        sex: member.sex,
        status: member.status,
        updatedAt: new DateTimeVo(member.updatedAt),
        updatedBy: member.updatedBy,
        userId: member.userId,
      },
      member.user ? this._userMapper.toDomain(member.user) : undefined,
    );
  }

  protected getEntity(member: Member): MemberEntity {
    return new MemberEntity({
      _id: member._id,
      address: new MemberAddressEntity({
        cityGovId: member.address.cityGovId,
        cityName: member.address.cityName,
        stateGovId: member.address.stateGovId,
        stateName: member.address.stateName,
        street: member.address.street,
        zipCode: member.address.zipCode,
      }),
      birthDate: member.birthDate?.toDate() ?? null,
      category: member.category,
      createdAt: member.createdAt.toDate(),
      createdBy: member.createdBy,
      deletedAt: member.deletedAt?.toDate() ?? null,
      deletedBy: member.deletedBy,
      documentID: member.documentID,
      fileStatus: member.fileStatus,
      firstName: member.firstName,
      isDeleted: member.isDeleted,
      lastName: member.lastName,
      maritalStatus: member.maritalStatus,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: member.status,
      updatedAt: member.updatedAt.toDate(),
      updatedBy: member.updatedBy,
      userId: member.userId,
    });
  }
}
