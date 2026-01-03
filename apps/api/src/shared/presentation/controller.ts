import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import { AppLogger } from '@/shared/application/app-logger';
import { Result } from '@/shared/domain/result';

import { ApplicationError } from '../domain/errors/application.error';
import { ConflictError } from '../domain/errors/conflict.error';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';
import { ErrorMapper } from '../domain/errors/error.mapper';
import { QueryContext } from '../domain/repository';
import { UniqueId } from '../domain/value-objects/unique-id/unique-id.vo';

export abstract class BaseController {
  protected constructor(protected readonly logger: AppLogger) {
    this.logger.setContext(this.constructor.name);
  }

  protected buildQueryContext(session: AuthSession): QueryContext {
    return {
      memberId: session.memberId
        ? UniqueId.raw({ value: session.memberId })
        : undefined,
    };
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
