import { Accounts } from 'meteor/accounts-base';
import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { InternalServerError } from '@application/errors/internal-server.error';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { PermissionEnum, RoleEnum, ScopeEnum } from '@domain/roles/role.enum';
import { EditAdminError } from '@domain/users/errors/edit-admin.error';
import { ExistingUserByEmailError } from '@domain/users/errors/existing-user-by-email.error';
import { UserNotFoundError } from '@domain/users/errors/user-not-found.error';
import { UpdateUserRequestDto } from '@domain/users/use-cases/update-user/update-user-request.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class UpdateUserUseCase
  extends UseCase<UpdateUserRequestDto>
  implements IUseCase<UpdateUserRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
  ) {
    super();
  }

  public async execute(
    request: UpdateUserRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Users, PermissionEnum.Update);

    const user = await Meteor.users.findOneAsync(request.id);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!user.profile) {
      throw new InternalServerError();
    }

    if (user.profile?.role === RoleEnum.Admin) {
      return err(new EditAdminError());
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const email of request.emails ?? []) {
      const userHasEmail = user.emails?.some(
        (userEmail) => userEmail.address === email,
      );

      if (!userHasEmail) {
        const existingUserByEmail = Accounts.findUserByEmail(email);

        if (existingUserByEmail && existingUserByEmail._id !== request.id) {
          return err(new ExistingUserByEmailError(email));
        }

        Accounts.addEmail(user._id, email);
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const email of user.emails ?? []) {
      const emailIsInRequest = request.emails?.includes(email.address);

      if (!emailIsInRequest) {
        Accounts.removeEmail(user._id, email.address);
      }
    }

    await Meteor.users.updateAsync(request.id, {
      $set: {
        'profile.firstName': request.firstName.trim(),
        'profile.lastName': request.lastName.trim(),
        state: request.state,
      },
    });

    this._logger.info('User updated', { userId: request.id });

    return ok(null);
  }
}
