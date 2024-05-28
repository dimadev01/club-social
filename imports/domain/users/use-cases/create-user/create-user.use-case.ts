import { Random } from 'meteor/random';
import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { RolePermissionAssignment } from '@domain/roles/roles';
import { AtLeastOneEmailInUseError } from '@domain/users/errors/at-least-one-email-in-use.error';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class CreateUserUseCase
  extends UseCase<CreateUserRequestDto>
  implements IUseCaseOld<CreateUserRequestDto, string>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
  ) {
    super();
  }

  public async execute(
    request: CreateUserRequestDto,
  ): Promise<Result<string, Error>> {
    await this.validatePermission(ScopeEnum.USERS, PermissionEnum.CREATE);

    if (request.emails?.some((email) => Accounts.findUserByEmail(email))) {
      return err(new AtLeastOneEmailInUseError());
    }

    const userId = Accounts.createUser({
      profile: {
        firstName: request.firstName,
        lastName: request.lastName,
        role: request.role,
        state: UserStateEnum.ACTIVE,
        theme: UserThemeEnum.AUTO,
      },
      username: Random.secret(),
    });

    if (request.emails && request.emails.length > 0) {
      request.emails.forEach((email) => {
        Accounts.addEmail(userId, email);
      });
    }

    const role = RolePermissionAssignment[request.role];

    Object.entries(role).forEach(([key, value]) => {
      Roles.addUsersToRoles(userId, value, key);
    });

    this._logger.info('User created', { userId });

    return ok(userId);
  }
}
