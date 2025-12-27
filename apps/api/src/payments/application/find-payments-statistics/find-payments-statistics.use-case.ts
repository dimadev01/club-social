import { DueCategory } from '@club-social/shared/dues';
import {
  IPaymentStatisticsByCategoryItemDto,
  IPaymentStatisticsDto,
} from '@club-social/shared/payments';
import { Inject, Injectable } from '@nestjs/common';
import { meanBy, sumBy, uniqBy } from 'es-toolkit/compat';

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
export class FindPaymentsStatisticsUseCase extends UseCase<IPaymentStatisticsDto> {
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
  ): Promise<Result<IPaymentStatisticsDto>> {
    const paymentDues = await this.paymentRepository.findForStatistics({
      dateRange: params.dateRange,
    });

    const categories = Object.values(DueCategory).reduce(
      (acc, category) => {
        const items = paymentDues.filter((pd) => pd.due.category === category);

        if (items.length > 0) {
          const amount = sumBy(items, (pd) =>
            pd.dueSettlement.amount.toCents(),
          );
          const average = meanBy(items, (pd) =>
            pd.dueSettlement.amount.toCents(),
          );
          const count = items.length;

          acc[category] = { amount, average, count };
        } else {
          acc[category] = { amount: 0, average: 0, count: 0 };
        }

        return acc;
      },
      {} as Record<DueCategory, IPaymentStatisticsByCategoryItemDto>,
    );

    const uniquePaymentDuesByPayment = uniqBy(
      paymentDues,
      (pd) => pd.payment.id.value,
    );
    const average = meanBy(uniquePaymentDuesByPayment, (pd) =>
      pd.payment.amount.toCents(),
    );
    const totalAmount = sumBy(paymentDues, (pd) =>
      pd.dueSettlement.amount.toCents(),
    );
    const paymentsCount = uniquePaymentDuesByPayment.length;
    const paymentDuesCount = paymentDues.length;

    return ok({
      average,
      categories,
      paymentDuesCount,
      paymentsCount,
      totalAmount,
    });
  }
}
