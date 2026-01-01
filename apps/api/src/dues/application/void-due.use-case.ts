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
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, type Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface VoidDueParams {
  id: string;
  voidedBy: string;
  voidReason: string;
}

@Injectable()
export class VoidDueUseCase extends UseCase {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: VoidDueParams): Promise<Result> {
    this.logger.info({
      message: 'Voiding due',
      params,
    });

    const due = await this.dueRepository.findByIdOrThrow(
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
    this.eventPublisher.dispatch(due);

    return ok();
  }
}
