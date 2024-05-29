import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { InternalServerError } from '@application/errors/internal-server.error';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { PermissionEnum, RoleEnum, ScopeEnum } from '@domain/roles/role.enum';
import { RolePermissionAssignment } from '@domain/roles/roles';
import { RemoveAdminError } from '@domain/users/errors/remove-admin.error';
import { RemoveYourselfError } from '@domain/users/errors/remove-yourself.error';
import { UserNotFoundError } from '@domain/users/errors/user-not-found.error';
import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class RemoveUserUseCase
  extends UseCase<RemoveUserRequestDto>
  implements IUseCaseOld<RemoveUserRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
  ) {
    super();
  }

  public async execute(
    request: RemoveUserRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.MEMBERS, PermissionEnum.DELETE);

    await this.validateDto(RemoveUserRequestDto, request);

    if (request.id === Meteor.userId()) {
      return err(new RemoveYourselfError());
    }

    const user = await Meteor.users.findOneAsync(request.id);

    if (!user) {
      return err(new UserNotFoundError());
    }

    if (!user.profile) {
      return err(new InternalServerError());
    }

    if (user.profile?.role === RoleEnum.ADMIN) {
      return err(new RemoveAdminError());
    }

    const userRole = user.profile.role as RoleEnum;

    Object.entries(RolePermissionAssignment[userRole]).forEach(
      ([key, value]) => {
        Roles.removeUsersFromRoles(request.id, value, key);
      },
    );

    await Meteor.users.removeAsync(request.id);

    this._logger.info('User removed', { user });

    return ok(null);
  }
}
