import { injectable } from 'tsyringe';

import { UpdateUserThemeRequestDto } from './use-cases/update-user-theme/update-user-theme-request.dto';
import { UpdateUserThemeUseCase } from './use-cases/update-user-theme/update-user-theme.use-case';

import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { GetUserUseCase } from '@domain/users/use-cases/get-user/get-user.use-case';
import { GetUserByTokenRequestDto } from '@domain/users/use-cases/get-user-by-token/get-user-by-token-request.dto';
import { GetUserByTokenUseCase } from '@domain/users/use-cases/get-user-by-token/get-user-by-token.use-case';
import { GetUsersRequestDto } from '@domain/users/use-cases/get-users-grid/get-users-grid-request.dto';
import { GetUsersUseCase } from '@domain/users/use-cases/get-users-grid/get-users-grid.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';

@injectable()
export class UserMethod extends MeteorMethod {
  public constructor(
    private readonly _getUsers: GetUsersUseCase,
    private readonly _getUser: GetUserUseCase,
    private readonly _getUserByToken: GetUserByTokenUseCase,
    private readonly _updateUserTheme: UpdateUserThemeUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.UsersGetGrid]: (request: GetUsersRequestDto) =>
        this.execute(this._getUsers, request),

      [MeteorMethodEnum.UsersGet]: (request: GetUserRequestDto) =>
        this.execute(this._getUser, request),

      [MeteorMethodEnum.UsersGetByToken]: (request: GetUserByTokenRequestDto) =>
        this.execute(this._getUserByToken, request),

      [MeteorMethodEnum.UsersUpdateTheme]: (
        request: UpdateUserThemeRequestDto,
      ) =>
        this.execute(this._updateUserTheme, request, UpdateUserThemeRequestDto),
    });
  }
}
