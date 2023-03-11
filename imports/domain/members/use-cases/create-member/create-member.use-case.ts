import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { Role } from '@domain/roles/roles.enum';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class CreateMemberUseCase
  extends UseCase<CreateMemberRequestDto>
  implements IUseCase<CreateMemberRequestDto, string>
{
  public constructor(
    private readonly _createUserUseCase: CreateUserUseCase,
    private readonly _logger: Logger
  ) {
    super();
  }

  public async execute(
    request: CreateMemberRequestDto
  ): Promise<Result<string, Error>> {
    await this.validateDto(CreateMemberRequestDto, request);

    const createUserResult = await this._createUserUseCase.execute({
      emails: request.emails,
      firstName: request.firstName,
      lastName: request.lastName,
      role: Role.Member,
    });

    if (createUserResult.isErr()) {
      return err(createUserResult.error);
    }

    const member = Member.create({
      address: {
        cityGovId: request.addressCityGovId,
        cityName: request.addressCityName,
        stateGovId: request.addressStateGovId,
        stateName: request.addressStateName,
        street: request.addressStreet,
        zipCode: request.addressZipCode,
      },
      category: request.category,
      dateOfBirth: request.dateOfBirth,
      documentID: request.documentID,
      emails: request.emails,
      fileStatus: request.fileStatus,
      firstName: request.firstName,
      lastName: request.lastName,
      maritalStatus: request.maritalStatus,
      nationality: request.nationality,
      phones: request.phones,
      sex: request.sex,
      status: request.status,
      userId: createUserResult.value,
    });

    if (member.isErr()) {
      return err(member.error);
    }

    await MembersCollection.insertEntity(member.value);

    this._logger.info('Member created', { member });

    return ok(member.value._id);
  }
}
