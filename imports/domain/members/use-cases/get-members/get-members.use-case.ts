import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@domain/common/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  FindMembersRequest,
  IMemberRepository,
} from '@domain/members/member-repository.interface';
import { GetMemberResponse } from '@domain/members/use-cases/get-member/get-member.response';

@injectable()
export class GetMembersUseCase
  implements IUseCase<FindMembersRequest, GetMemberResponse[]>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: FindMembersRequest,
  ): Promise<Result<GetMemberResponse[], Error>> {
    console.log('🚀 ~ request:', request);

    const data = await this._memberRepository.find(request);

    return ok<GetMemberResponse[]>(
      data.map<GetMemberResponse>((member) => {
        invariant(member.user);

        return {
          _id: member._id,
          addressCityGovId: member.address.cityGovId,
          addressCityName: member.address.cityName,
          addressStateGovId: member.address.stateGovId,
          addressStateName: member.address.stateName,
          addressStreet: member.address.street,
          addressZipCode: member.address.zipCode,
          category: member.category,
          dateOfBirth: member.dateOfBirth,
          documentID: member.documentID,
          emails: member.user?.emails?.map((email) => email.address) ?? [],
          fileStatus: member.fileStatus,
          firstName: member.user.firstName,
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
