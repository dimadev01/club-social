import invariant from 'tiny-invariant';
import { injectable } from 'tsyringe';

import { MemberDto } from '@application/members/dtos/member.dto';
import { Member } from '@domain/members/models/member.model';
import { MapperDto } from '@ui/common/mapper/dto-mapper';

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
      firstName: member.firstName,
      id: member._id,
      lastName: member.lastName,
      maritalStatus: member.maritalStatus,
      name: member.nameLastFirst,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: member.status,
    };
  }
}
