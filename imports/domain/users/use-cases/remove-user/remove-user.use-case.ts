import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { ILogger } from '@application/logger/logger.interface';
import { Permission, Role, Scope, StaffRole } from '@domain/roles/roles.enum';
import { RemoveAdminError } from '@domain/users/errors/remove-admin.error';
import { RemoveYourselfError } from '@domain/users/errors/remove-yourself.error';
import { UserNotFoundError } from '@domain/users/errors/user-not-found.error';
import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { Tokens } from '@infra/di/di-tokens';

@injectable()
export class RemoveUserUseCase
  extends UseCase<RemoveUserRequestDto>
  implements IUseCase<RemoveUserRequestDto, undefined>
{
  public constructor(
    @inject(Tokens.Logger)
    private readonly _logger: ILogger
  ) {
    super();
  }

  public async execute(
    request: RemoveUserRequestDto
  ): Promise<Result<undefined, Error>> {
    this.validatePermission(Scope.Members, Permission.Delete);

    await this.validateDto(RemoveUserRequestDto, request);

    if (request.id === Meteor.userId()) {
      return err(new RemoveYourselfError());
    }

    const user = await Meteor.users.findOneAsync(request.id);

    if (!user) {
      return err(new UserNotFoundError());
    }

    if (user.profile?.role === Role.Admin) {
      return err(new RemoveAdminError());
    }

    Object.entries(StaffRole).forEach(([key, value]) => {
      Roles.removeUsersFromRoles(request.id, value, key);
    });

    await Meteor.users.removeAsync(request.id);

    this._logger.info('User removed', { user });

    return ok(undefined);
  }
}
