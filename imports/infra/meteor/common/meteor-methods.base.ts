import { container, injectable } from 'tsyringe';
import { IUseCase } from '@application/common/use-case.interfaces';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { MeteorErrorCodeEnum } from '@infra/meteor/common/meteor-errors.enum';

@injectable()
export class BaseMethod {
  protected async execute<TRequest, TResponse>(
    useCase: IUseCase<TRequest, TResponse>,
    request?: TRequest
  ): Promise<TResponse> {
    try {
      const result = await useCase.execute(request);

      if (result.isErr()) {
        throw new Meteor.Error(
          MeteorErrorCodeEnum.BadRequest,
          result.error.message
        );
      }

      return result.value;
    } catch (error) {
      container.resolve(LoggerOstrio).error(error);

      if (error instanceof Meteor.Error) {
        throw error;
      }

      if (error instanceof Error) {
        throw new Meteor.Error(
          MeteorErrorCodeEnum.InternalServerError,
          error.message
        );
      }

      throw new Meteor.Error(
        MeteorErrorCodeEnum.InternalServerError,
        'Unexpected and unhandled server error'
      );
    }
  }
}
