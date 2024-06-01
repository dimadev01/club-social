import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { MemberModelDto } from '@application/members/dtos/member-model.dto';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';
import { DIToken } from '@domain/common/tokens.di';
import { IModelUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/repositories/member.repository';
import { IUserRepository } from '@domain/users/repositories/user.repository';

@injectable()
export class GetMemberUseCase implements IModelUseCase<MemberModelDto | null> {
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(
    request: FindOneModelByIdRequest,
  ): Promise<Result<MemberModelDto | null, Error>> {
    const member = await this._memberRepository.findOneById(request);

    if (!member) {
      return err(new ModelNotFoundError());
    }

    member.user = await this._userRepository.findOneByIdOrThrow({
      id: member.userId,
    });

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
