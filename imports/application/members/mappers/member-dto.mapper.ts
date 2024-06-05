import invariant from 'tiny-invariant';
import { injectable } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { MemberDto } from '@application/members/dtos/member.dto';
import { Member } from '@domain/members/models/member.model';

@injectable()
export class MemberDtoMapper extends MapperDto<Member, MemberDto> {
  public toDto(domain: Member): MemberDto {
    invariant(domain.user);

    return {
      addressCityGovId: domain.address.cityGovId,
      addressCityName: domain.address.cityName,
      addressStateGovId: domain.address.stateGovId,
      addressStateName: domain.address.stateName,
      addressStreet: domain.address.street,
      addressZipCode: domain.address.zipCode,
      birthDate: domain.birthDate?.toISOString() ?? null,
      category: domain.category,
      documentID: domain.documentID,
      emails: [],
      fileStatus: domain.fileStatus,
      firstName: domain.user.firstName,
      id: domain._id,
      lastName: domain.user.lastName,
      maritalStatus: domain.maritalStatus,
      name: domain.name,
      nationality: domain.nationality,
      phones: domain.phones,
      sex: domain.sex,
      status: domain.status,
    };
  }
}
