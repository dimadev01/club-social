import { Accounts } from 'meteor/accounts-base';
import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Permission, Role, Scope } from '@domain/roles/roles.enum';
import { EditAdminError } from '@domain/users/errors/edit-admin.error';
import { ExistingUserByEmailError } from '@domain/users/errors/existing-user-by-email.error';
import { UserNotFoundError } from '@domain/users/errors/user-not-found.error';
import { UpdateUserRequestDto } from '@domain/users/use-cases/update-user/update-user-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class UpdateUserUseCase
  extends UseCase<UpdateUserRequestDto>
  implements IUseCase<UpdateUserRequestDto, undefined>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: UpdateUserRequestDto
  ): Promise<Result<undefined, Error>> {
    this.validatePermission(Scope.Users, Permission.Update);

    await this.validateDto(UpdateUserRequestDto, request);

    const user = await Meteor.users.findOneAsync(request.id);

    if (!user) {
      return err(new UserNotFoundError());
    }

    if (user.profile?.role === Role.Admin) {
      return err(new EditAdminError());
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const email of request.emails ?? []) {
      const userHasEmail = user.emails?.some(
        (userEmail) => userEmail.address === email
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
        'profile.firstName': request.firstName,
        'profile.lastName': request.lastName,
      },
    });

    this._logger.info('User updated', { userId: request.id });

    return ok(undefined);
  }
}
