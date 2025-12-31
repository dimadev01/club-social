import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { AppLogger } from '@/shared/application/app-logger';
import { Result } from '@/shared/domain/result';

import { ApplicationError } from '../domain/errors/application.error';
import { ConflictError } from '../domain/errors/conflict.error';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';
import { ErrorMapper } from '../domain/errors/error.mapper';

export abstract class BaseController {
  protected constructor(protected readonly logger: AppLogger) {
    this.logger.setContext(this.constructor.name);
  }

  protected handleResult<T>(result: Result<T>): T {
    if (result.isOk()) {
      return result.value;
    }

    const error = result.error;

    if (error instanceof HttpException) {
      throw error;
    }

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundException(error.message, { cause: error });
    }

    if (error instanceof ConflictError) {
      throw new ConflictException(error.message, { cause: error });
    }

    if (error instanceof ApplicationError) {
      throw new BadRequestException(error.message, { cause: error });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new InternalServerErrorException(
      ErrorMapper.unknownToError(error).message,
    );
  }
}
