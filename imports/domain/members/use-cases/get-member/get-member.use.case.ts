import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@domain/common/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import { MemberNotFoundError } from '@domain/members/errors/member-not-found.error';
import { IMemberRepository } from '@domain/members/member-repository.interface';
import { GetMemberRequest } from '@domain/members/use-cases/get-member/get-member.request';
import { GetMemberResponse } from '@domain/members/use-cases/get-member/get-member.response';
import { IUserRepository } from '@domain/users/user-repository.interface';

@injectable()
export class GetMemberUseCase
  implements IUseCase<GetMemberRequest, GetMemberResponse | null>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(
    request: GetMemberRequest,
  ): Promise<Result<GetMemberResponse | null, Error>> {
    const member = await this._memberRepository.findOneById(request.id);

    if (!member) {
      return err(new MemberNotFoundError());
    }

    member.user = await this._userRepository.findOneByIdOrThrow(member.userId);

    return ok<GetMemberResponse>({
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
      emails: member.user.emails?.map((email) => email.address) ?? [],
      fileStatus: member.fileStatus,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      maritalStatus: member.maritalStatus,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: member.status,
    });
  }
}
