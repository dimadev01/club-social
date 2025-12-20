import { DueStatus } from '@club-social/shared/dues';
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

    const due = await this.dueRepository.findOneByIdOrThrow(
      UniqueId.raw({ value: params.dueId }),
    );

    if (due.isVoided()) {
      return err(new ApplicationError('No se puede pagar una cuota anulada'));
    }

    if (due.isPaid()) {
      return err(new ApplicationError('La cuota ya está pagada'));
    }

    const results = ResultUtils.combine([
      Amount.fromCents(params.amount),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [amount, date] = results.value;

    const payment = PaymentEntity.create({
      amount,
      createdBy: params.createdBy,
      date,
      dueId: UniqueId.raw({ value: params.dueId }),
      notes: params.notes,
    });

    if (payment.isErr()) {
      return err(payment.error);
    }

    await this.paymentRepository.save(payment.value);

    const allPayments = await this.paymentRepository.findByDueId(due.id);
    const totalPaid = allPayments.reduce(
      (sum, p) => sum.add(p.amount),
      Amount.raw({ cents: 0 }),
    );

    let newDueStatus: DueStatus;

    if (totalPaid.isGreaterThanOrEqual(due.amount)) {
      newDueStatus = DueStatus.PAID;
    } else if (totalPaid.isGreaterThan(Amount.raw({ cents: 0 }))) {
      newDueStatus = DueStatus.PARTIALLY_PAID;
    } else {
      newDueStatus = DueStatus.PENDING;
    }

    if (due.status !== newDueStatus) {
      due.updateStatus(newDueStatus, params.createdBy);
      await this.dueRepository.save(due);
    }

    this.eventPublisher.dispatch(payment.value);

    return ok(payment.value);
  }
}
