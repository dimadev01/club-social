import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MemberDto } from '@application/members/dtos/member.dto';
import { GetMemberRequest } from '@application/members/use-cases/get-member/get-member.request';
import { GetMemberResponse } from '@application/members/use-cases/get-member/get-member.response';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/repositories/member.repository';
import { IUserRepository } from '@domain/users/repositories/user.repository';

@injectable()
export class GetMemberUseCase
  implements IUseCase<GetMemberRequest, GetMemberResponse>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(
    request: GetMemberRequest,
  ): Promise<Result<GetMemberResponse, Error>> {
    const member = await this._memberRepository.findOneById(request);

    if (!member) {
      return err(new ModelNotFoundError());
    }

    member.user = await this._userRepository.findOneByIdOrThrow({
      id: member.userId,
    });

    return ok<MemberDto>({
      addressCityGovId: member.address.cityGovId,
      addressCityName: member.address.cityName,
      addressStateGovId: member.address.stateGovId,
      addressStateName: member.address.stateName,
      addressStreet: member.address.street,
      addressZipCode: member.address.zipCode,
      birthDate: member.birthDate?.toISOString() ?? null,
      category: member.category,
      documentID: member.documentID,
      emails: member.user.emails?.map((email) => email.address) ?? [],
      fileStatus: member.fileStatus,
      firstName: member.user.firstName,
      id: member._id,
      lastName: member.user.lastName,
      maritalStatus: member.maritalStatus,
      name: member.user.name,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: member.status,
    });
  }
}
