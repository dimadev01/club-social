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
import { EntityNotFoundError } from '@/shared/domain/errors/entity-not-found.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok } from '@/shared/domain/result';
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

    const due = await this.dueRepository.findOneById(
      UniqueId.raw({ value: params.dueId }),
    );

    if (!due) {
      return err(new EntityNotFoundError('Cuota no encontrada'));
    }

    if (due.status === DueStatus.VOIDED) {
      return err(new ApplicationError('No se puede pagar una cuota anulada'));
    }

    if (due.status === DueStatus.PAID) {
      return err(new ApplicationError('La cuota ya está pagada'));
    }

    const payment = PaymentEntity.create({
      amount: params.amount,
      createdBy: params.createdBy,
      date: params.date,
      dueId: UniqueId.raw({ value: params.dueId }),
      notes: params.notes,
    });

    if (payment.isErr()) {
      return err(payment.error);
    }

    await this.paymentRepository.save(payment.value);

    // Calculate new due status based on total payments
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
      due.updateStatus(newStatus, params.createdBy);
      await this.dueRepository.save(due);
    }

    this.eventPublisher.dispatch(payment.value);

    return ok(payment.value);
  }
}
