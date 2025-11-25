import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { ApplicationError } from '@/domain/shared/errors/application.error';
import { ConflictError } from '@/domain/shared/errors/conflict.error';
import { EntityNotFoundError } from '@/domain/shared/errors/entity-not-found.error';
import { ErrorMapper } from '@/domain/shared/errors/error.mapper';
import { InternalServerError } from '@/domain/shared/errors/internal-server.error';
import { Result } from '@/domain/shared/result';

export abstract class BaseController {
  protected handleResult<T>(result: Result<T>): T {
    if (result.isOk()) {
      return result.value;
    }

    const error = result.error;

    if (error instanceof HttpException) {
      throw error;
    }

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundException(error.message);
    }

    if (error instanceof ConflictError) {
      throw new ConflictException(error.message);
    }

    if (error instanceof ApplicationError) {
      throw new BadRequestException(error.message);
    }

    if (error instanceof InternalServerError) {
      throw new InternalServerErrorException(error.message);
    }

    if (error instanceof Error) {
      throw new InternalServerErrorException(error.message);
    }

    throw new InternalServerErrorException(
      ErrorMapper.unknownToError(error).message,
    );
  }
}
