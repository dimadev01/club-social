import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { injectable } from 'tsyringe';

import { UpdateUserThemeRequestDto } from './update-user-theme-request.dto';

import { IUseCaseOld } from '@application/use-cases-old/use-case.interface';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class UpdateUserThemeUseCase
  extends UseCaseOld<UpdateUserThemeRequestDto>
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

    invariant(user);

    await Meteor.users.updateAsync(user._id, {
      $set: { 'profile.theme': request.theme },
    });

    return ok(null);
  }
}
