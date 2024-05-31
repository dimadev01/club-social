import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCaseNewV } from '@domain/common/use-case.interface';
import { MeteorBadRequestError } from '@infra/meteor/errors/meteor-bad-request.error';
import { MeteorInternalServerError } from '@infra/meteor/errors/meteor-internal-server.error';
import { ClassValidationError } from '@infra/mongo/errors/class-validation.error';

export interface ExecuteRequest<TRequest, TResponse> {
  classType?: ClassType<TRequest>;
  request?: TRequest;
  useCase: IUseCaseNewV<TRequest, TResponse>;
}

export abstract class BaseController {
  public constructor(private readonly _logger: ILogger) {}

  protected abstract register(): void;

  protected async execute<TRequest, TResponse>({
    useCase,
    classType,
    request,
  }: ExecuteRequest<TRequest, TResponse>): Promise<TResponse> {
    try {
      if (request && classType && typeof classType === 'object') {
        await this._validateDto(classType, request);
      }

      const result = await useCase.execute(request);

      if (result.isErr()) {
        if (result.error instanceof ClassValidationError) {
          throw result.error;
        }

        throw new MeteorBadRequestError(result.error.message);
      }

      return result.value;
    } catch (error) {
      this._logger.error(error, { request });

      if (error instanceof ClassValidationError) {
        throw new MeteorInternalServerError(
          error.message,
          JSON.stringify(error.errors, null, 2),
        );
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

      throw new MeteorInternalServerError();
    }
  }
}
