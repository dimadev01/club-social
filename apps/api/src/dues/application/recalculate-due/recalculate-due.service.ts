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
import { ok, Result } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

@Injectable()
export class RecalculateDueService extends UseCase {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
  ) {
    super(logger);
  }

  public async execute(id: UniqueId): Promise<Result> {
    this.logger.info({
      id,
      message: 'Recalculating due',
    });

    const due = await this.dueRepository.findOneByIdOrThrow(id);

    const allPaymentDues = await this.dueRepository.findPaymentDuesByDueId(id);

    const totalPaid = allPaymentDues.reduce(
      (sum, pd) => sum.add(pd.amount),
      Amount.raw({ cents: 0 }),
    );

    due.recalculateStatus(totalPaid);

    await this.dueRepository.save(due);

    return ok();
  }
}
