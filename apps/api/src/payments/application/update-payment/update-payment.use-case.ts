import { DueStatus } from '@club-social/shared/dues';
import { Inject } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';

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
import { err, ok } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type { UpdatePaymentParams } from './update-payment.params';

export class UpdatePaymentUseCase extends UseCase<PaymentEntity> {
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
    params: UpdatePaymentParams,
  ): Promise<Result<PaymentEntity>> {
    this.logger.info({
      message: 'Updating payment',
      params,
    });

    const payment = await this.paymentRepository.findOneByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const due = await this.dueRepository.findOneByIdOrThrow(payment.dueId);

    if (due.status === DueStatus.VOIDED) {
      return err(
        new ApplicationError('No se puede editar un pago de una cuota anulada'),
      );
    }

    payment.update({
      amount: params.amount,
      date: params.date,
      notes: params.notes,
      updatedBy: params.updatedBy,
    });

    await this.paymentRepository.save(payment);

    // Recalculate due status based on total payments
    const allPayments = await this.paymentRepository.findByDueId(due.id);
    const totalPaid = allPayments.reduce(
      (sum, p) => sum.add(p.amount),
      new Decimal(0),
    );

    let newStatus: DueStatus;

    if (totalPaid.gte(due.amount.toCents())) {
      newStatus = DueStatus.PAID;
    } else if (totalPaid.gt(new Decimal(0))) {
      newStatus = DueStatus.PARTIALLY_PAID;
    } else {
      newStatus = DueStatus.PENDING;
    }

    if (due.status !== newStatus) {
      due.updateStatus(newStatus, params.updatedBy);
      await this.dueRepository.save(due);
    }

    this.eventPublisher.dispatch(payment);

    return ok(payment);
  }
}
