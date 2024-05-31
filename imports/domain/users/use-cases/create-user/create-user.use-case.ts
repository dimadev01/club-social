import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@domain/common/tokens.di';
import { IUseCaseNewV } from '@domain/common/use-case.interface';
import { ExistingUserByEmailError } from '@domain/users/errors/existing-user-by-email.error';
import { UserModel } from '@domain/users/models/user.model';
import { CreateUserRequest } from '@domain/users/use-cases/create-user/create-user.request';
import { CreateUserResponse } from '@domain/users/use-cases/create-user/create-user.response';
import { IUserRepository } from '@domain/users/user-repository.interface';

@injectable()
export class CreateUserNewUseCase<TSession>
  implements IUseCaseNewV<CreateUserRequest<TSession>, CreateUserResponse>
{
  public constructor(
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository<TSession>,
  ) {}

  public async execute(
    request: CreateUserRequest<TSession>,
  ): Promise<Result<CreateUserResponse, Error>> {
    const validation = await this._validate(request);

    if (validation.isErr()) {
      return err(validation.error);
    }

    const user = UserModel.createOne({
      emails:
        request.emails?.map((email) => ({
          address: email,
          verified: false,
        })) ?? null,
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
        request.unitOfWork.get(),
      );
    } else {
      await this._userRepository.insert(user.value);
    }

    return ok({ id: user.value._id });
  }

  private async _validate(
    request: CreateUserRequest<TSession>,
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
