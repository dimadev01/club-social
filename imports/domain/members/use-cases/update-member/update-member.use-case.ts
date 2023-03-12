import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MemberNotFoundError } from '@domain/members/errors/member-not-found.error';
import { MembersCollection } from '@domain/members/members.collection';
import { UpdateMemberRequestDto } from '@domain/members/use-cases/update-member/update-member-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { GetUserUseCase } from '@domain/users/use-cases/get-user/get-user.use-case';
import { UpdateUserUseCase } from '@domain/users/use-cases/update-user/update-user.use-case';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class UpdateMemberUseCase
  extends UseCase<UpdateMemberRequestDto>
  implements IUseCase<UpdateMemberRequestDto, undefined>
{
  public constructor(
    private readonly _updateUser: UpdateUserUseCase,
    private readonly _getUser: GetUserUseCase,
    private readonly _logger: Logger
  ) {
    super();
  }

  public async execute(
    request: UpdateMemberRequestDto
  ): Promise<Result<undefined, Error>> {
    this.validatePermission(Scope.Members, Permission.Update);

    await this.validateDto(UpdateMemberRequestDto, request);

    const member = await MembersCollection.findOneAsync(request.id);

    if (!member) {
      return err(new MemberNotFoundError());
    }

    const updateUserResult = await this._updateUser.execute({
      emails: request.emails,
      firstName: request.firstName,
      id: member.userId,
      lastName: request.lastName,
    });

    if (updateUserResult.isErr()) {
      return err(updateUserResult.error);
    }

    const user = await this._getUser.execute({ id: member.userId });

    if (user.isErr()) {
      return err(user.error);
    }

    if (!user.value) {
      return err(new MemberNotFoundError());
    }

    if (request.dateOfBirth) {
      member.dateOfBirth = new Date(request.dateOfBirth);
    } else {
      member.dateOfBirth = null;
    }

    member.category = request.category;

    member.documentID = request.documentID;

    member.fileStatus = request.fileStatus;

    member.maritalStatus = request.maritalStatus;

    member.nationality = request.nationality;

    member.phones = request.phones;

    member.sex = request.sex;

    member.status = request.status;

    member.firstName = request.firstName;

    member.lastName = request.lastName;

    member.emails = user.value.emails ?? null;

    member.address = {
      cityGovId: request.addressCityGovId,
      cityName: request.addressCityName,
      stateGovId: request.addressStateGovId,
      stateName: request.addressStateName,
      street: request.addressStreet,
      zipCode: request.addressZipCode,
    };

    await MembersCollection.updateEntity(member);

    this._logger.info('Member updated', { memberId: request.id });

    return ok(undefined);
  }
}
