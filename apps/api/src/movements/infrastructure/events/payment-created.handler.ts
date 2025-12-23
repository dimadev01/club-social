import { MovementCategory, MovementType } from '@club-social/shared/movements';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MovementEntity } from '@/movements/domain/entities/movement.entity';
import {
  MOVEMENT_REPOSITORY_PROVIDER,
  type MovementRepository,
} from '@/movements/domain/movement.repository';
import { PaymentCreatedEvent } from '@/payments/domain/events/payment-created.event';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';

@Injectable()
export class PaymentCreatedHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    @Inject(MOVEMENT_REPOSITORY_PROVIDER)
    private readonly movementRepository: MovementRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    this.logger.setContext(PaymentCreatedHandler.name);
  }

  @OnEvent(PaymentCreatedEvent.name)
  public async handle(event: PaymentCreatedEvent): Promise<void> {
    this.logger.info({
      message: `Handling ${PaymentCreatedEvent.name}`,
      paymentId: event.payment.id.value,
    });

    try {
      const existingMovement = await this.movementRepository.findByPaymentId(
        event.payment.id,
      );

      if (existingMovement) {
        this.logger.warn({
          message: 'Movement already exists for payment',
          movementId: existingMovement.id.value,
          paymentId: event.payment.id.value,
        });

        return;
      }

      const movementResult = MovementEntity.create({
        amount: event.payment.amount,
        category: MovementCategory.MEMBERSHIP_FEE,
        createdBy: event.payment.createdBy,
        date: event.payment.date,
        description: 'Entrada automática',
        paymentId: event.payment.id,
        type: MovementType.INFLOW,
      });

      if (movementResult.isErr()) {
        this.logger.error({
          error: movementResult.error,
          message: 'Failed to create movement entity',
          paymentId: event.payment.id.value,
        });

        return;
      }

      const movement = movementResult.value;

      await this.movementRepository.save(movement);
      this.eventPublisher.dispatch(movement);

      this.logger.info({
        message: 'Movement created successfully',
        movementId: movement.id.value,
        paymentId: event.payment.id.value,
      });
    } catch (error) {
      this.logger.error({
        error,
        message: 'Unexpected error creating movement from payment',
        paymentId: event.payment.id.value,
      });
    }
  }
}
