import invariant from 'tiny-invariant';
import { injectable } from 'tsyringe';

import { MapperDto } from '@adapters/common/mapper/dto-mapper';
import { MemberDto } from '@application/members/dtos/member.dto';
import { Member } from '@domain/members/models/member.model';

@injectable()
export class MemberDtoMapper extends MapperDto<Member, MemberDto> {
  public toDto(member: Member): MemberDto {
    invariant(member.user);

    return {
      addressCityGovId: member.address.cityGovId,
      addressCityName: member.address.cityName,
      addressStateGovId: member.address.stateGovId,
      addressStateName: member.address.stateName,
      addressStreet: member.address.street,
      addressZipCode: member.address.zipCode,
      birthDate: member.birthDate?.toISOString() ?? null,
      category: member.category,
      documentID: member.documentID,
      emails: member.user.emails.map((email) => email.address),
      fileStatus: member.fileStatus,
      firstName: member.user.firstName,
      id: member._id,
      lastName: member.user.lastName,
      maritalStatus: member.maritalStatus,
      name: member.name,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: member.status,
    };
  }
}
