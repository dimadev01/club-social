import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MemberDto } from '@application/members/dtos/member.dto';
import { GetMembersRequest } from '@application/members/use-cases/get-members/get-members.request';
import { GetMembersResponse } from '@application/members/use-cases/get-members/get-members.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/repositories/member.repository';

@injectable()
export class GetMembersUseCase
  implements IUseCase<GetMembersRequest, GetMembersResponse>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: GetMembersRequest,
  ): Promise<Result<GetMembersResponse, Error>> {
    const members = await this._memberRepository.find({
      category: request.category,
      status: request.status,
    });

    return ok<GetMembersResponse>(
      members.map<MemberDto>((member) => {
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
          emails: member.user?.emails?.map((email) => email.address) ?? [],
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
          userId: member.userId,
        };
      }),
    );
  }
}
