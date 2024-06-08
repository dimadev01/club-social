import { injectable } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { GetUserByTokenRequestDto } from '@application/users/dtos/get-user-by-token-request.dto';
import { UpdateUserThemeRequestDto } from '@application/users/dtos/update-user-theme-request.dto';
import { GetUserByTokenUseCase } from '@application/users/use-cases/get-user-by-token/get-user-by-token.use-case';
import { UpdateUserThemeUseCase } from '@application/users/use-cases/update-user/update-user-theme.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';

@injectable()
export class UserMethodOld extends MeteorMethod {
  public constructor(
    private readonly _getUserByToken: GetUserByTokenUseCase,
    private readonly _updateUserTheme: UpdateUserThemeUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.UsersGetByToken]: (request: GetUserByTokenRequestDto) =>
        this.execute(this._getUserByToken, request),

      [MeteorMethodEnum.UsersUpdateTheme]: (
        request: UpdateUserThemeRequestDto,
      ) =>
        this.execute(this._updateUserTheme, request, UpdateUserThemeRequestDto),
    });
  }
}
