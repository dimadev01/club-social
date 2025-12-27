import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import {
  MemberCreateInput,
  MemberModel,
  MemberUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberEntity } from '../domain/entities/member.entity';

@Injectable()
export class PrismaMemberMapper {
  public toCreateInput(member: MemberEntity): MemberCreateInput {
    Guard.string(member.createdBy);

    return {
      birthDate: member.birthDate?.value ?? null,
      category: member.category,
      cityName: member.address?.cityName ?? null,
      createdBy: member.createdBy,
      documentID: member.documentID,
      fileStatus: member.fileStatus,
      id: member.id.value,
      maritalStatus: member.maritalStatus,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      stateName: member.address?.stateName ?? null,
      street: member.address?.street ?? null,
      user: { connect: { id: member.userId.value } },
      zipCode: member.address?.zipCode ?? null,
    };
  }

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
        birthDate: member.birthDate
          ? DateOnly.raw({ value: member.birthDate })
          : null,
        category: member.category as MemberCategory,
        documentID: member.documentID,
        fileStatus: member.fileStatus as FileStatus,
        maritalStatus: member.maritalStatus as MaritalStatus | null,
        nationality: member.nationality as MemberNationality | null,
        phones: member.phones,
        sex: member.sex as MemberSex,
        userId: UniqueId.raw({ value: member.userId }),
      },
      {
        audit: {
          createdAt: member.createdAt,
          createdBy: member.createdBy,
          updatedAt: member.updatedAt,
          updatedBy: member.updatedBy,
        },
        id: UniqueId.raw({ value: member.id }),
      },
    );
  }

  public toUpdateInput(member: MemberEntity): MemberUpdateInput {
    Guard.string(member.createdBy);
    Guard.string(member.updatedBy);

    return {
      birthDate: member.birthDate?.value ?? null,
      category: member.category,
      cityName: member.address?.cityName ?? null,
      documentID: member.documentID,
      fileStatus: member.fileStatus,
      id: member.id.value,
      maritalStatus: member.maritalStatus,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      stateName: member.address?.stateName ?? null,
      street: member.address?.street ?? null,
      updatedAt: member.updatedAt ?? new Date(),
      updatedBy: member.updatedBy,
      zipCode: member.address?.zipCode ?? null,
    };
  }
}
