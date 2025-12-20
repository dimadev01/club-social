import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { RecalculateDueService } from '@/dues/application/recalculate-due/recalculate-due.service';
import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import { PaymentDueProps } from '@/payments/domain/payment.interface';
import {
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '@/payments/domain/payment.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type { CreatePaymentParams } from './create-payment.params';

export class CreatePaymentUseCase extends UseCase<PaymentEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepository: PaymentRepository,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly recalculateDueService: RecalculateDueService,
  ) {
    super(logger);
  }

  public async execute(
    params: CreatePaymentParams,
  ): Promise<Result<PaymentEntity>> {
    this.logger.info({
      message: 'Creating payment',
      params,
    });

    const dueIds = params.paymentDues.map((pd) =>
      UniqueId.raw({ value: pd.dueId }),
    );
    const dues = await this.dueRepository.findManyByIds(dueIds);

    if (dues.length !== dueIds.length) {
      return err(new ApplicationError('Una o más cuotas no existen'));
    }

    if (dues.some((due) => due.isVoided())) {
      return err(
        new ApplicationError('No se puede crear un pago con cuotas anuladas'),
      );
    }

    const dateResult = DateOnly.fromString(params.date);

    if (dateResult.isErr()) {
      return err(dateResult.error);
    }

    const paymentDuesResult: Result<PaymentDueProps[]> = ResultUtils.combine(
      params.paymentDues.map((pd) => {
        const amount = Amount.fromCents(pd.amount);

        if (amount.isErr()) {
          return err(amount.error);
        }

        return ok({
          amount: amount.value,
          dueId: UniqueId.raw({ value: pd.dueId }),
        });
      }),
    );

    if (paymentDuesResult.isErr()) {
      return err(paymentDuesResult.error);
    }

    const paymentDues = paymentDuesResult.value;

    const paymentResult = PaymentEntity.create({
      createdBy: params.createdBy,
      date: dateResult.value,
      notes: params.notes,
      paymentDues,
      receiptNumber: params.receiptNumber,
    });

    if (paymentResult.isErr()) {
      return err(paymentResult.error);
    }

    const payment = paymentResult.value;

    await this.paymentRepository.save(payment);

    const recalculateDuesResult = await ResultUtils.combineAsync(
      dues.map((due) => this.recalculateDueService.execute(due.id)),
    );

    if (recalculateDuesResult.isErr()) {
      return err(recalculateDuesResult.error);
    }

    this.eventPublisher.dispatch(payment);

    return ok(payment);
  }
}
