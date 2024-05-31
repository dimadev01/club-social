import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { container } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { MeteorErrorCodeEnum } from '@infra/meteor/common/meteor-errors.enum';
import { ClassValidationUtils } from '@shared/utils/validation.utils';

export abstract class MeteorMethod {
  protected async execute<TRequest extends object, TResponse>(
    useCase: IUseCase<TRequest, TResponse>,
    request?: TRequest,
    classType?: ClassType<TRequest>,
  ): Promise<TResponse> {
    try {
      if (request && classType) {
        await this.validateDto(classType, request);
      }

      const result = await useCase.execute(request);

      if (result.isErr()) {
        throw new Meteor.Error(
          MeteorErrorCodeEnum.BAD_REQUEST,
          result.error.message,
        );
      }

      return result.value;
    } catch (error) {
      container.resolve<ILogger>(DIToken.Logger).error(error);

      if (error instanceof Meteor.Error) {
        throw error;
      }

      if (error instanceof Error) {
        throw new Meteor.Error(
          MeteorErrorCodeEnum.INTERNAL_SERVER_ERROR,
          error.message,
        );
      }

      throw new Meteor.Error(
        MeteorErrorCodeEnum.INTERNAL_SERVER_ERROR,
        'Unexpected and unhandled server error',
      );
    }
  }

  protected async validateDto<T extends object>(
    classType: ClassType<T>,
    value: T,
  ): Promise<void> {
    if (!value) {
      throw new Meteor.Error(
        MeteorErrorCodeEnum.BAD_REQUEST,
        'Request is empty',
      );
    }

    try {
      await transformAndValidate(classType, value);
    } catch (err) {
      const errors = err as ValidationError[];

      throw new Meteor.Error(
        MeteorErrorCodeEnum.BAD_REQUEST,
        ClassValidationUtils.getErrorMessage(errors),
      );
    }
  }
}
