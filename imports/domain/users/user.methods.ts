import { injectable } from 'tsyringe';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';
import { GetUserByTokenRequestDto } from '@domain/users/use-cases/get-user-by-token/get-user-by-token-request.dto';
import { GetUserByTokenUseCase } from '@domain/users/use-cases/get-user-by-token/get-user-by-token.use-case';
import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { GetUserUseCase } from '@domain/users/use-cases/get-user/get-user.use-case';
import { GetUsersRequestDto } from '@domain/users/use-cases/get-users-grid/get-users-grid-request.dto';
import { GetUsersUseCase } from '@domain/users/use-cases/get-users-grid/get-users-grid.use-case';
import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { RemoveUserUseCase } from '@domain/users/use-cases/remove-user/remove-user.use-case';
import { UpdateUserRequestDto } from '@domain/users/use-cases/update-user/update-user-request.dto';
import { UpdateUserUseCase } from '@domain/users/use-cases/update-user/update-user.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class UserMethod extends MeteorMethod {
  public constructor(
    private readonly _getUsers: GetUsersUseCase,
    private readonly _getUser: GetUserUseCase,
    private readonly _createUser: CreateUserUseCase,
    private readonly _getUserByToken: GetUserByTokenUseCase,
    private readonly _removeUser: RemoveUserUseCase,
    private readonly _updateUser: UpdateUserUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.UsersGetGrid]: (request: GetUsersRequestDto) =>
        this.execute(this._getUsers, request),

      [MethodsEnum.UsersGet]: (request: GetUserRequestDto) =>
        this.execute(this._getUser, request),

      [MethodsEnum.UsersGetByToken]: (request: GetUserByTokenRequestDto) =>
        this.execute(this._getUserByToken, request),

      [MethodsEnum.UsersCreate]: (request: CreateUserRequestDto) =>
        this.execute(this._createUser, request),

      [MethodsEnum.UsersRemove]: (request: RemoveUserRequestDto) =>
        this.execute(this._removeUser, request),

      [MethodsEnum.UsersUpdate]: (request: UpdateUserRequestDto) =>
        this.execute(this._updateUser, request),
    });
  }
}
