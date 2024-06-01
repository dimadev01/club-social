import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { MemberModelDto } from '@application/members/dtos/member-model-dto';
import { GetModelRequest } from '@domain/common/requests/get-model.request';
import { DIToken } from '@domain/common/tokens.di';
import { IEntityDtoUseCase } from '@domain/common/use-case.interface';
import { MemberNotFoundError } from '@domain/members/errors/member-not-found.error';
import { IMemberRepository } from '@domain/members/repositories/member.repository';
import { IUserRepository } from '@domain/users/repositories/user-repository.interface';

@injectable()
export class GetMemberUseCase
  implements IEntityDtoUseCase<MemberModelDto | null>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(
    request: GetModelRequest,
  ): Promise<Result<MemberModelDto | null, Error>> {
    const member = await this._memberRepository.findOneById(request.id);

    if (!member) {
      return err(new MemberNotFoundError());
    }

    member.user = await this._userRepository.findOneByIdOrThrow(member.userId);

    return ok<MemberModelDto>({
      _id: member._id,
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
