import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { RecalculateDueService } from '@/dues/application/recalculate-due/recalculate-due.service';
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
    private readonly recalculateDueService: RecalculateDueService,
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

    const oldDueIds = payment.affectedDueIds;

    const newDueIds = params.paymentDues.map((pd) =>
      UniqueId.raw({ value: pd.dueId }),
    );
    const allDueIds = [...new Set([...newDueIds, ...oldDueIds])];
    const dues = await this.dueRepository.findManyByIds(allDueIds);

    if (dues.length !== allDueIds.length) {
      return err(new ApplicationError('Una o más cuotas no existen'));
    }

    const voidedDue = dues.find((due) => due.isVoided());

    if (voidedDue) {
      return err(
        new ApplicationError('No se puede editar un pago de una cuota anulada'),
      );
    }

    const dateResult = DateOnly.fromString(params.date);

    if (dateResult.isErr()) {
      return err(dateResult.error);
    }

    const paymentDueResults: Result<{ amount: Amount; dueId: UniqueId }>[] =
      params.paymentDues.map((pd) => {
        const amountResult = Amount.fromCents(pd.amount);

        if (amountResult.isErr()) {
          return err(amountResult.error);
        }

        return ok({
          amount: amountResult.value,
          dueId: UniqueId.raw({ value: pd.dueId }),
        });
      });

    const combinedResult = ResultUtils.combine(paymentDueResults);

    if (combinedResult.isErr()) {
      return err(combinedResult.error);
    }

    const paymentDues = combinedResult.value;

    const updateResult = payment.update({
      date: dateResult.value,
      notes: params.notes,
      paymentDues: paymentDues,
      updatedBy: params.updatedBy,
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

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
