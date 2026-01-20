import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { MovementCategoryLabel } from '@club-social/shared/movements';
import {
  NotificationChannel,
  NotificationSourceEntity,
  NotificationType,
} from '@club-social/shared/notifications';
import { Inject } from '@nestjs/common';

import { ResendNotificationEmailTemplate } from '@/infrastructure/email/resend/resend.types';
import { NotificationEntity } from '@/notifications/domain/entities/notification.entity';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, type Result, ResultUtils } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

import { MovementEntity } from '../domain/entities/movement.entity';
import {
  MOVEMENT_REPOSITORY_PROVIDER,
  type MovementRepository,
} from '../domain/movement.repository';

export interface VoidMovementParams {
  createdByUserId: string;
  id: string;
  voidedBy: string;
  voidReason: string;
}

export class VoidMovementUseCase extends UseCase {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MOVEMENT_REPOSITORY_PROVIDER)
    private readonly movementRepository: MovementRepository,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: VoidMovementParams): Promise<Result> {
    this.logger.info({ message: 'Voiding movement', params });

    const originalMovement = await this.movementRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    if (originalMovement.isAutomatic()) {
      return err(
        new ApplicationError('No se puede anular un movimiento automático'),
      );
    }

    const voidResult = originalMovement.void({
      voidedBy: params.voidedBy,
      voidReason: params.voidReason,
    });

    if (voidResult.isErr()) {
      return err(voidResult.error);
    }

    const subscriberNotifications = await this.createSubscriberNotifications({
      createdBy: params.voidedBy,
      createdByUserId: params.createdByUserId,
      movement: originalMovement,
      voidReason: params.voidReason,
    });

    if (subscriberNotifications.isErr()) {
      return err(subscriberNotifications.error);
    }

    await this.unitOfWork.execute(
      async ({ movementRepository, notificationRepository }) => {
        await movementRepository.save(originalMovement);
        await Promise.all(
          subscriberNotifications.value.map((notification) =>
            notificationRepository.save(notification),
          ),
        );
      },
    );

    this.eventPublisher.dispatch(originalMovement);
    subscriberNotifications.value.forEach((notification) =>
      this.eventPublisher.dispatch(notification),
    );

    return ok();
  }

  private async createSubscriberNotifications(props: {
    createdBy: string;
    createdByUserId: string;
    movement: MovementEntity;
    voidReason: string;
  }): Promise<Result<NotificationEntity[]>> {
    const optedInUsers =
      await this.userRepository.findWithNotifyOnMovementVoided();

    // Exclude the member's own user to avoid duplicate notification
    const subscribers = optedInUsers.filter(
      (user) => user.id.value !== props.createdByUserId,
    );

    const result = ResultUtils.combine(
      subscribers.map((subscriber) =>
        NotificationEntity.create(
          {
            channel: NotificationChannel.EMAIL,
            payload: {
              template: ResendNotificationEmailTemplate.MOVEMENT_VOIDED,
              variables: {
                amount: NumberFormat.currencyCents(props.movement.amount.cents),
                category: MovementCategoryLabel[props.movement.category],
                date: DateFormat.date(props.movement.date.value),
                reason: props.voidReason,
                userName: subscriber.name.firstName,
                voidedBy: props.createdBy,
              },
            },
            recipientAddress: subscriber.email.value,
            sourceEntity: NotificationSourceEntity.MOVEMENT,
            sourceEntityId: props.movement.id,
            type: NotificationType.MOVEMENT_VOIDED,
            userId: subscriber.id,
          },
          props.createdBy,
        ),
      ),
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }
}
