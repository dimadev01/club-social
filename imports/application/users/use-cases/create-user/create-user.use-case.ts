import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { CreateUserRequest } from '@application/users/use-cases/create-user/create-user.request';
import { CreateUserResponse } from '@application/users/use-cases/create-user/create-user.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { ExistingUserByEmailError } from '@domain/users/errors/existing-user-by-email.error';
import { User } from '@domain/users/models/user.model';
import { IUserRepository } from '@domain/users/repositories/user.repository';

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

    const user = User.createOne({
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
