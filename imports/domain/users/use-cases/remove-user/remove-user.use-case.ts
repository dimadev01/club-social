import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { StaffRole } from '@domain/roles/roles.enum';
import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class RemoveUserUseCase
  extends UseCase<RemoveUserRequestDto>
  implements IUseCase<RemoveUserRequestDto, undefined>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: RemoveUserRequestDto
  ): Promise<Result<undefined, Error>> {
    await this.validateDto(RemoveUserRequestDto, request);

    if (request.id === Meteor.userId()) {
      return err(new Error('No puedes eliminarte a ti mismo'));
    }

    const user = await Meteor.users.findOneAsync(request.id);

    if (!user) {
      return err(new Error('User not found'));
    }

    Object.entries(StaffRole).forEach(([key, value]) => {
      Roles.removeUsersFromRoles(request.id, value, key);
    });

    await Meteor.users.removeAsync(request.id);

    this._logger.info('User updated', { user });

    return ok(undefined);
  }
}
