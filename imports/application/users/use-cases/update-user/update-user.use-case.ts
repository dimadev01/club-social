import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import { IUserRepository } from '@application/users/repositories/user.repository';
import { UpdateUserRequest } from '@application/users/use-cases/update-user/update-user.request';
import { ExistingUserByEmailError } from '@domain/users/errors/existing-user-by-email.error';
import { UserEmail } from '@domain/users/models/user-email.model';
import { User } from '@domain/users/models/user.model';

@injectable()
export class UpdateUserUseCase implements IUseCase<UpdateUserRequest, User> {
  public constructor(
    @inject(DIToken.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  public async execute(
    request: UpdateUserRequest,
  ): Promise<Result<User, Error>> {
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
      user.setIsActive(request.isActive),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    if (request.unitOfWork) {
      await this._userRepository.updateWithSession(user, request.unitOfWork);
    } else {
      await this._userRepository.update(user);
    }

    return ok(user);
  }

  private _getEmails(
    request: UpdateUserRequest,
    user: User,
  ): Result<UserEmail[], Error> {
    if (!request.emails) {
      return ok([]);
    }

    const result = request.emails.map((email) => {
      const userEmail = user.emails?.find((e) => e.address === email);

      if (userEmail) {
        userEmail.setAddress(email);

        return ok(userEmail);
      }

      return UserEmail.create({
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
    request: UpdateUserRequest,
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
