import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import invariant from 'tiny-invariant';
import { container } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { IUseCase } from '@application/common/use-case.interface';
import { DomainError } from '@domain/common/errors/domain.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { MeteorBadRequestError } from '@infra/meteor/errors/meteor-bad-request.error';
import { MeteorInternalServerError } from '@infra/meteor/errors/meteor-internal-server.error';
import { ClassValidationError } from '@ui/common/errors/class-validation.error';

export interface ExecuteRequest<TRequest extends object, TResponse> {
  classType?: ClassType<TRequest>;
  request?: TRequest;
  useCase: IUseCase<TRequest, TResponse>;
}

export abstract class MeteorMethods {
  public abstract register(): void;

  protected async execute<TRequest extends object, TResponse>(
    useCase: IUseCase<TRequest, TResponse>,
    classType?: ClassType<TRequest>,
    request?: TRequest,
  ): Promise<TResponse> {
    try {
      if (request && classType) {
        await this._validateDto(classType, request);
      }

      const result = await useCase.execute(request);

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    } catch (error) {
      container
        .resolve<ILoggerService>(DIToken.ILoggerService)
        .error(error, { classType: classType?.name, request });

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

  protected getCurrentUserName(): string {
    const user = this.getCurrentUser();

    invariant(user.profile);

    return `${user.profile.firstName} ${user.profile.lastName}`;
  }

  protected handleError(error: unknown): never {
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

  private async _validateDto<T extends object>(
    classType: ClassType<T>,
    value: T,
  ): Promise<void> {
    try {
      await transformAndValidate(classType, value);
    } catch (error) {
      if (
        Array.isArray(error) &&
        error.every((e) => e instanceof ValidationError)
      ) {
        throw new ClassValidationError(error);
      }

      throw new InternalServerError();
    }
  }
}
