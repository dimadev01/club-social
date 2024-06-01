import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@domain/common/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import { ExistingUserByEmailError } from '@domain/users/errors/existing-user-by-email.error';
import { UserEmailModel } from '@domain/users/models/user-email.model';
import { UserModel } from '@domain/users/models/user.model';
import { IUserRepository } from '@domain/users/repositories/user.repository';
import { UpdateUserRequest } from '@domain/users/user.types';

@injectable()
export class UpdateUserUseCase<TSession>
  implements IUseCase<UpdateUserRequest<TSession>, null>
{
  public constructor(
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository<TSession>,
  ) {}

  public async execute(
    request: UpdateUserRequest<TSession>,
  ): Promise<Result<null, Error>> {
    const validation = await this._validate(request);

    if (validation.isErr()) {
      return err(validation.error);
    }

    const user = await this._userRepository.findOneByIdOrThrow(request);

    const emails = this._getEmails(request, user);

    if (emails.isErr()) {
      return err(emails.error);
    }

    const result = Result.combine([
      user.setFirstName(request.firstName),
      user.setLastName(request.lastName),
      user.setRole(request.role),
      user.setEmails(emails.value),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    if (request.unitOfWork) {
      await this._userRepository.updateWithSession(
        user,
        request.unitOfWork.get(),
      );
    } else {
      await this._userRepository.update(user);
    }

    return ok(null);
  }

  private _getEmails(
    request: UpdateUserRequest<TSession>,
    user: UserModel,
  ): Result<UserEmailModel[], Error> {
    if (!request.emails) {
      return ok([]);
    }

    const result = request.emails.map((email) => {
      const userEmail = user.emails?.find((e) => e.address === email);

      if (userEmail) {
        userEmail.setAddress(email);

        return ok(userEmail);
      }

      return UserEmailModel.createOne({
        address: email,
        verified: false,
      });
    });

    const combined = Result.combine(result);

    if (combined.isErr()) {
      return err(combined.error);
    }

    return ok(combined.value);
  }

  private async _validate(
    request: UpdateUserRequest<TSession>,
  ): Promise<Result<null, Error>> {
    if (!request.emails) {
      return ok(null);
    }

    const result = await Promise.all(
      request.emails.map(async (email) => {
        const user = await this._userRepository.findByEmail(email);

        if (user && user._id !== request.id) {
          return err(new ExistingUserByEmailError(email));
        }

        return ok(null);
      }),
    );

    const combined = Result.combine(result);

    if (combined.isErr()) {
      return err(combined.error);
    }

    return ok(null);
  }
}
