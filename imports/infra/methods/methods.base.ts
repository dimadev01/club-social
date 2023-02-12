import { container, injectable } from 'tsyringe';
import { Logger } from '@infra/logger/logger.service';
import { MeteorErrorCode } from '@kernel/errors.enum';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class BaseMethod {
  protected async execute<TRequest, TResponse>(
    useCase: IUseCase<TRequest, TResponse>,
    request: TRequest
  ): Promise<TResponse> {
    try {
      const result = await useCase.execute(request);

      if (result.isErr()) {
        throw new Meteor.Error(
          MeteorErrorCode.BadRequest,
          result.error.message
        );
      }

      return result.value;
    } catch (error) {
      container.resolve(Logger).error(error);

      if (error instanceof Meteor.Error) {
        throw error;
      }

      if (error instanceof Error) {
        throw new Meteor.Error(
          MeteorErrorCode.InternalServerError,
          error.message
        );
      }

      throw new Meteor.Error(
        MeteorErrorCode.InternalServerError,
        'Unexpected and unhandled server error'
      );
    }
  }
}
