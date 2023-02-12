import { injectable } from 'tsyringe';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';
import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { GetUserUseCase } from '@domain/users/use-cases/get-user/get-user.use-case';
import { GetUsersRequestDto } from '@domain/users/use-cases/get-users/get-users-request.dto';
import { GetUsersUseCase } from '@domain/users/use-cases/get-users/get-users.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class UsersMethods extends BaseMethod {
  public constructor(
    private readonly _getUsersUseCase: GetUsersUseCase,
    private readonly _getUserUseCase: GetUserUseCase,
    private readonly _createUserUseCase: CreateUserUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.UsersGet]: (request: GetUsersRequestDto) =>
        this.execute(this._getUsersUseCase, request),
      [MethodsEnum.UsersGetOne]: (request: GetUserRequestDto) =>
        this.execute(this._getUserUseCase, request),
      [MethodsEnum.UsersCreate]: (request: CreateUserRequestDto) =>
        this.execute(this._createUserUseCase, request),
    });
  }
}
