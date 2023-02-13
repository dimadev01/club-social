import { toLower } from 'lodash';
import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Role } from '@domain/roles/roles.enum';
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
    await this.validateDto(UpdateUserRequestDto, request);

    const user = await Meteor.users.findOneAsync(request.id);

    if (!user) {
      return err(new Error('User not found'));
    }

    if (user.profile?.role === Role.Admin) {
      return err(new Error('No puedes editar a un administrador'));
    }

    await Meteor.users.updateAsync(request.id, {
      $set: {
        'profile.firstName': request.firstName,
        'profile.lastName': request.lastName,
      },
    });

    const email = toLower(request.email);

    if (user.emails && user.emails[0].address !== email) {
      Accounts.removeEmail(user._id, user.emails[0].address);

      Accounts.addEmail(user._id, email);

      Accounts.sendVerificationEmail(user._id, email);
    }

    this._logger.info('User updated', { userId: request.id });

    return ok(undefined);
  }
}
