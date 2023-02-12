import { toLower } from 'lodash';
import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { UpdateUserRequestDto } from '@domain/users/use-cases/update-user/update-user-request.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class UpdateUserUseCase
  extends UseCase<UpdateUserRequestDto>
  implements IUseCase<UpdateUserRequestDto, undefined>
{
  public async execute(
    request: UpdateUserRequestDto
  ): Promise<Result<undefined, Error>> {
    await this.validateDto(UpdateUserRequestDto, request);

    const user = await Meteor.users.findOneAsync(request.id);

    if (!user) {
      return err(new Error('User not found'));
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

    return ok(undefined);
  }
}
