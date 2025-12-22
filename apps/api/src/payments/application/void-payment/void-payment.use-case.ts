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
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type { VoidPaymentParams } from './void-payment.params';

export class VoidPaymentUseCase extends UseCase<PaymentEntity> {
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
    params: VoidPaymentParams,
  ): Promise<Result<PaymentEntity>> {
    this.logger.info({
      message: 'Voiding payment',
      params,
    });

    const payment = await this.paymentRepository.findUniqueOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const affectedDueIds = payment.affectedDueIds;

    const voidResult = payment.void({
      voidedBy: params.voidedBy,
      voidReason: params.voidReason,
    });

    if (voidResult.isErr()) {
      return err(voidResult.error);
    }

    const dues = await this.dueRepository.findUniqueByIds(affectedDueIds);

    const voidPaymentResults = ResultUtils.combine(
      dues.map((due) => due.voidPayment(payment.id, params.voidedBy)),
    );

    if (voidPaymentResults.isErr()) {
      return err(voidPaymentResults.error);
    }

    await this.paymentRepository.save(payment);
    await Promise.all(dues.map((due) => this.dueRepository.save(due)));

    this.eventPublisher.dispatch(payment);
    dues.forEach((due) => this.eventPublisher.dispatch(due));

    return ok(payment);
  }
}
