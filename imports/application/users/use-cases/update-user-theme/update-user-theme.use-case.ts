import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases-old/use-case.interface';
import { UpdateUserThemeRequestDto } from '@application/users/dtos/update-user-theme-request.dto';
import { OldUseCase } from '@infra/use-cases/use-case';

@injectable()
export class UpdateUserThemeUseCase
  extends OldUseCase<UpdateUserThemeRequestDto>
  implements IUseCaseOld<UpdateUserThemeRequestDto, null>
{
  public constructor() {
    super();
  }

  public async execute(
    request: UpdateUserThemeRequestDto,
  ): Promise<Result<null, Error>> {
    const user = Meteor.user();

    invariant(user);

    await Meteor.users.updateAsync(user._id, {
      $set: { 'profile.theme': request.theme },
    });

    return ok(null);
  }
}
