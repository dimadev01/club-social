import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@domain/common/use-case.interface';
import { MeteorErrorCodeEnum } from '@infra/meteor/common/meteor-errors.enum';
import { ClassValidationUtils } from '@shared/utils/validation.utils';

export interface ExecuteRequest<TRequest, TResponse> {
  classType?: ClassType<TRequest>;
  request?: TRequest;
  useCase: IUseCase<TRequest, TResponse>;
}

export abstract class BaseController {
  public constructor(private readonly _logger: ILogger) {}

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
        throw new Meteor.Error(
          MeteorErrorCodeEnum.BadRequest,
          result.error.message,
        );
      }

      return result.value;
    } catch (error) {
      this._logger.error(error);

      if (error instanceof Meteor.Error) {
        throw error;
      }

      if (error instanceof Error) {
        throw new Meteor.Error(
          MeteorErrorCodeEnum.InternalServerError,
          error.message,
        );
      }

      throw new Meteor.Error(
        MeteorErrorCodeEnum.InternalServerError,
        'Unexpected and unhandled server error',
      );
    }
  }

  private async _validateDto<T extends object>(
    classType: ClassType<T>,
    value: T,
  ): Promise<void> {
    if (!value) {
      throw new Meteor.Error(
        MeteorErrorCodeEnum.BadRequest,
        'Request is empty',
      );
    }

    try {
      await transformAndValidate(classType, value);
    } catch (err) {
      const errors = err as ValidationError[];

      throw new Meteor.Error(
        MeteorErrorCodeEnum.BadRequest,
        ClassValidationUtils.getErrorMessage(errors),
      );
    }
  }
}
