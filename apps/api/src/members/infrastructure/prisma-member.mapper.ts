import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import { MemberModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from '../domain/entities/member.entity';

@Injectable()
export class PrismaMemberMapper extends Mapper<MemberEntity, MemberModel> {
  public toDomain(member: MemberModel): MemberEntity {
    const address =
      member.street || member.cityName || member.stateName || member.zipCode
        ? Address.raw({
            cityName: member.cityName,
            stateName: member.stateName,
            street: member.street,
            zipCode: member.zipCode,
          })
        : null;

    return MemberEntity.fromPersistence(
      {
        address,
        birthDate: member.birthDate,
        category: member.category as MemberCategory,
        createdBy: member.createdBy,
        documentID: member.documentID,
        fileStatus: member.fileStatus as FileStatus,
        maritalStatus: member.maritalStatus as MaritalStatus | null,
        nationality: member.nationality as MemberNationality | null,
        phones: member.phones,
        sex: member.sex as MemberSex,
        userId: UniqueId.raw({ value: member.userId }),
      },
      {
        createdAt: member.createdAt,
        createdBy: member.createdBy,
        deletedAt: member.deletedAt,
        deletedBy: member.deletedBy,
        id: UniqueId.raw({ value: member.id }),
        updatedAt: member.updatedAt,
        updatedBy: member.updatedBy,
      },
    );
  }

  public toPersistence(member: MemberEntity): MemberModel {
    return {
      birthDate: member.birthDate,
      category: member.category,
      cityName: member.address?.cityName ?? null,
      createdAt: member.createdAt,
      createdBy: member.createdBy,
      deletedAt: member.deletedAt,
      deletedBy: member.deletedBy,
      documentID: member.documentID,
      fileStatus: member.fileStatus,
      id: member.id.value,
      maritalStatus: member.maritalStatus,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      stateName: member.address?.stateName ?? null,
      street: member.address?.street ?? null,
      updatedAt: member.updatedAt,
      updatedBy: member.updatedBy,
      userId: member.userId.value,
      zipCode: member.address?.zipCode ?? null,
    };
  }
}
