import { Inject, Injectable } from '@nestjs/common';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { err, ok, type Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type { VoidDueParams } from './void-due.params';

@Injectable()
export class VoidDueUseCase extends UseCase {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
  ) {
    super(logger);
  }

  public async execute(params: VoidDueParams): Promise<Result> {
    this.logger.info({
      message: 'Voiding due',
      params,
    });

    const due = await this.dueRepository.findOneByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const voidResult = due.void({
      voidedBy: params.voidedBy,
      voidReason: params.voidReason,
    });

    if (voidResult.isErr()) {
      return err(voidResult.error);
    }

    await this.dueRepository.save(due);

    return ok();
  }
}
