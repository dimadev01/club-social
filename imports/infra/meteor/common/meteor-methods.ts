import invariant from 'tiny-invariant';

import { ClassValidationError } from '@adapters/common/errors/class-validation.error';
import { DomainError } from '@domain/common/errors/base.error';
import { MeteorBadRequestError } from '@infra/meteor/errors/meteor-bad-request.error';
import { MeteorInternalServerError } from '@infra/meteor/errors/meteor-internal-server.error';

export abstract class MeteorMethods {
  public abstract register(): void;

  protected async execute<TRequest, TResponse>(
    fn: (request: TRequest) => Promise<TResponse>,
    request: TRequest,
  ): Promise<TResponse> {
    try {
      return await fn(request);
    } catch (error) {
      if (error instanceof ClassValidationError) {
        throw new MeteorInternalServerError(
          error.message,
          JSON.stringify(error.errors, null, 2),
        );
      }

      if (error instanceof DomainError) {
        throw new MeteorBadRequestError(error.message);
      }

      if (error instanceof Error) {
        throw new MeteorBadRequestError(error.message);
      }

      if (error instanceof Meteor.Error) {
        throw error;
      }

      if (error instanceof Error) {
        throw new MeteorInternalServerError(error.message);
      }

      throw new MeteorInternalServerError(
        'Unexpected and unhandled server error',
      );
    }
  }

  protected getCurrentUser(): Meteor.User {
    const user = Meteor.user();

    invariant(user);

    return user;
  }

  protected getCurrentUserId(): string {
    const user = this.getCurrentUser();

    return user._id;
  }

  protected getCurrentUserName(): string {
    const user = this.getCurrentUser();

    invariant(user.profile);

    return `${user.profile.firstName} ${user.profile.lastName}`;
  }
}
