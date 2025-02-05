import { Roles } from 'meteor/alanning:roles';
import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import { IUserRepository } from '@application/users/repositories/user.repository';
import { CreateUserRequest } from '@application/users/use-cases/create-user/create-user.request';
import { CreateUserResponse } from '@application/users/use-cases/create-user/create-user.response';
import { RoleAssignment } from '@domain/roles/role.enum';
import { ExistingUserByEmailError } from '@domain/users/errors/existing-user-by-email.error';
import { User } from '@domain/users/models/user.model';

@injectable()
export class CreateUserUseCase
  implements IUseCase<CreateUserRequest, CreateUserResponse>
{
  public constructor(
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(
    request: CreateUserRequest,
  ): Promise<Result<CreateUserResponse, Error>> {
    const validation = await this._validate(request);

    if (validation.isErr()) {
      return err(validation.error);
    }

    const user = User.create({
      emails: request.emails?.map((email) => email) ?? null,
      firstName: request.firstName,
      lastName: request.lastName,
      role: request.role,
    });

    if (user.isErr()) {
      return err(user.error);
    }

    if (request.unitOfWork) {
      await this._userRepository.insertWithSession(
        user.value,
        request.unitOfWork,
      );
    } else {
      await this._userRepository.insert(user.value);
    }

    const role = RoleAssignment[user.value.role];

    await Promise.all(
      Object.entries(role).map(async ([scope, permissions]) => {
        await Roles.addUsersToRolesAsync(user.value._id, permissions, scope);
      }),
    );

    console.log(user.value);

    return ok(user.value);
  }

  private async _validate(
    request: CreateUserRequest,
  ): Promise<Result<null, Error>> {
    if (request.emails) {
      const result = await Promise.all(
        request.emails.map(async (email) => {
          const user = await this._userRepository.findByEmail(email);

          if (user) {
            return err(new ExistingUserByEmailError(email));
          }

          return ok(null);
        }),
      );

      const combined = Result.combine(result);

      if (combined.isErr()) {
        return err(combined.error);
      }
    }

    return ok(null);
  }
}
