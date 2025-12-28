import { DueCategory } from '@club-social/shared/dues';
import {
  IPaymentStatisticsByCategoryItemDto,
  PaymentStatistics,
} from '@club-social/shared/payments';
import { Inject, Injectable } from '@nestjs/common';
import { flatMap, meanBy, sumBy } from 'es-toolkit/compat';

import {
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '@/payments/domain/payment.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { FindForStatisticsParams } from '@/shared/domain/repository-types';
import { ok, Result } from '@/shared/domain/result';

@Injectable()
export class FindPaymentsStatisticsUseCase extends UseCase<PaymentStatistics> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepository: PaymentRepository,
  ) {
    super(logger);
  }

  public async execute(
    params: FindForStatisticsParams,
  ): Promise<Result<PaymentStatistics>> {
    const data = await this.paymentRepository.findForStatistics({
      dateRange: params.dateRange,
    });

    const total = sumBy(data, (s) => s.amount);
    const count = data.length;
    const dueSettlementsCount = sumBy(data, (s) => s.settlements.length);
    const average = meanBy(data, (s) => s.amount);

    const dueSettlements = flatMap(data, (s) => s.settlements);

    const categories = Object.values(DueCategory).reduce(
      (acc, category) => {
        const dueSettlementsInCategory = dueSettlements.filter(
          (ds) => ds.due.category === category,
        );

        if (dueSettlementsInCategory.length > 0) {
          const amount = sumBy(dueSettlementsInCategory, (ds) => ds.amount);
          const average = meanBy(dueSettlementsInCategory, (pd) => pd.amount);
          const count = dueSettlementsInCategory.length;
          acc[category] = { amount, average, count };
        } else {
          acc[category] = { amount: 0, average: 0, count: 0 };
        }

        return acc;
      },
      {} as Record<DueCategory, IPaymentStatisticsByCategoryItemDto>,
    );

    return ok({ average, categories, count, dueSettlementsCount, total });
  }
}
