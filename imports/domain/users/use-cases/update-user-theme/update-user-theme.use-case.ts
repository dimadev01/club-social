import { Result, ok } from 'neverthrow';
import { injectable } from 'tsyringe';

import { UpdateUserThemeRequestDto } from './update-user-theme-request.dto';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UserNotFoundError } from '@domain/users/errors/user-not-found.error';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class UpdateUserThemeUseCase
  extends UseCase<UpdateUserThemeRequestDto>
  implements IUseCaseOld<UpdateUserThemeRequestDto, null>
{
  public constructor() {
    super();
  }

  public async execute(
    request: UpdateUserThemeRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.USERS, PermissionEnum.UPDATE);

    const user = Meteor.user();

    if (!user) {
      throw new UserNotFoundError();
    }

    await Meteor.users.updateAsync(user._id, {
      $set: { 'profile.theme': request.theme },
    });

    return ok(null);
  }
}
