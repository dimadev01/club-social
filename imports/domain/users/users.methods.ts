import { injectable } from 'tsyringe';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';
import { GetUserByTokenRequestDto } from '@domain/users/use-cases/get-user-by-token/get-user-by-token-request.dto';
import { GetUserByTokenUseCase } from '@domain/users/use-cases/get-user-by-token/get-user-by-token.use-case';
import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { GetUserUseCase } from '@domain/users/use-cases/get-user/get-user.use-case';
import { GetUsersRequestDto } from '@domain/users/use-cases/get-users/get-users-request.dto';
import { GetUsersUseCase } from '@domain/users/use-cases/get-users/get-users.use-case';
import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { RemoveUserUseCase } from '@domain/users/use-cases/remove-user/remove-user.use-case';
import { UpdateUserRequestDto } from '@domain/users/use-cases/update-user/update-user-request.dto';
import { UpdateUserUseCase } from '@domain/users/use-cases/update-user/update-user.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class UsersMethods extends BaseMethod {
  public constructor(
    private readonly _getUsersUseCase: GetUsersUseCase,
    private readonly _getUserUseCase: GetUserUseCase,
    private readonly _createUserUseCase: CreateUserUseCase,
    private readonly _getUserByToken: GetUserByTokenUseCase,
    private readonly _removeUserUseCase: RemoveUserUseCase,
    private readonly _updateUserUseCase: UpdateUserUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.UsersGetGrid]: (request: GetUsersRequestDto) =>
        this.execute(this._getUsersUseCase, request),

      [MethodsEnum.UsersGet]: (request: GetUserRequestDto) =>
        this.execute(this._getUserUseCase, request),

      [MethodsEnum.UsersGetByToken]: (request: GetUserByTokenRequestDto) =>
        this.execute(this._getUserByToken, request),

      [MethodsEnum.UsersCreate]: (request: CreateUserRequestDto) =>
        this.execute(this._createUserUseCase, request),

      [MethodsEnum.UsersRemove]: (request: RemoveUserRequestDto) =>
        this.execute(this._removeUserUseCase, request),

      [MethodsEnum.UsersUpdate]: (request: UpdateUserRequestDto) =>
        this.execute(this._updateUserUseCase, request),
    });
  }
}
