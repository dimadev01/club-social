import { UserStatus } from '@club-social/shared/users';
import { Inject, Injectable } from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { EntityNotFoundError } from '@/shared/domain/errors/entity-not-found.error';
import { err, ok, Result } from '@/shared/domain/result';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import {
  USER_READABLE_REPOSITORY_PROVIDER,
  type UserReadableRepository,
} from '@/users/domain/user.repository';

@Injectable()
export class VerifySignInUseCase extends UseCase {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USER_READABLE_REPOSITORY_PROVIDER)
    private readonly userRepository: UserReadableRepository,
  ) {
    super(logger);
  }

  public async execute(email: string): Promise<Result<unknown, Error>> {
    const emailResult = Email.create(email);

    if (emailResult.isErr()) {
      return err(emailResult.error);
    }

    const user = await this.userRepository.findUniqueByEmail(emailResult.value);

    if (!user) {
      return err(new EntityNotFoundError('Usuario no encontrado'));
    }

    if (user.deletedAt) {
      return err(new EntityNotFoundError('Usuario no encontrado'));
    }

    if (user.status === UserStatus.INACTIVE) {
      return err(new EntityNotFoundError('Usuario inactivo'));
    }

    if (user.banned) {
      return err(new EntityNotFoundError('Usuario inactivo'));
    }

    return ok();
  }
}
