import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UserNotFoundError } from '@domain/users/errors/user-not-found.error';
import { UseCase } from '@infra/use-cases/use-case';
import { UpdateUserThemeRequestDto } from './update-user-theme-request.dto';

@injectable()
export class UpdateUserThemeUseCase
  extends UseCase<UpdateUserThemeRequestDto>
  implements IUseCase<UpdateUserThemeRequestDto, null>
{
  public constructor() {
    super();
  }

  public async execute(
    request: UpdateUserThemeRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Users, PermissionEnum.Update);

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
