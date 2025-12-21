import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
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
import { Guard } from '@/shared/domain/guards';
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

    const date = DateOnly.fromString(params.date);

    if (date.isErr()) {
      return err(date.error);
    }

    const paymentResult = PaymentEntity.create({
      createdBy: params.createdBy,
      date: date.value,
      dueIds,
      notes: params.notes,
      receiptNumber: params.receiptNumber,
    });

    if (paymentResult.isErr()) {
      return err(paymentResult.error);
    }

    const payment = paymentResult.value;

    const addPaymentResults = ResultUtils.combine(
      dues.map((due) => {
        const paymentDueForThisDue = params.paymentDues.find(
          (pd) => pd.dueId === due.id.value,
        );

        Guard.defined(paymentDueForThisDue);

        const amount = Amount.fromCents(paymentDueForThisDue.amount);

        if (amount.isErr()) {
          return err(amount.error);
        }

        payment.addToTotalAmount(amount.value);

        return due.addPayment(payment.id, amount.value, params.createdBy);
      }),
    );

    if (addPaymentResults.isErr()) {
      return err(addPaymentResults.error);
    }

    await this.paymentRepository.save(payment);
    await Promise.all(dues.map((due) => this.dueRepository.save(due)));

    this.eventPublisher.dispatch(payment);
    dues.forEach((due) => this.eventPublisher.dispatch(due));

    return ok(payment);
  }
}
