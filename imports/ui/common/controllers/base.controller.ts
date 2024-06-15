import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';

import { ILoggerRepository } from '@application/common/logger/logger.interface';
import { IUseCase } from '@application/common/use-case.interface';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { ClassValidationError } from '@ui/common/errors/class-validation.error';

export interface ExecuteRequest<TRequest extends object, TResponse> {
  classType?: ClassType<TRequest>;
  request?: TRequest;
  useCase: IUseCase<TRequest, TResponse>;
}

export abstract class BaseController {
  public constructor(private readonly _logger: ILoggerRepository) {}

  protected async execute<TRequest extends object, TResponse>({
    useCase,
    classType,
    request,
  }: ExecuteRequest<TRequest, TResponse>): Promise<TResponse> {
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
      this._logger.error(error, { request });

      throw error;
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

      throw new InternalServerError();
    }
  }
}
