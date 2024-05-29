import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IMemberRepository } from '@domain/members/member-repository.interface';
import { GetMemberResponse } from '@domain/members/use-cases/get-member/get-member.response';
import { GetMembersRequest } from '@domain/members/use-cases/get-members/get-members-request';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMembersUseCase
  extends UseCase
  implements IUseCaseOld<GetMembersRequest, GetMemberResponse[]>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {
    super();
  }

  public async execute(
    request: GetMembersRequest,
  ): Promise<Result<GetMemberResponse[], Error>> {
    const data = await this._memberRepository.find({
      status: request.status,
    });

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
