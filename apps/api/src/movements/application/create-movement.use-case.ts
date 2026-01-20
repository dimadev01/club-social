import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  MovementCategory,
  MovementCategoryLabel,
  MovementMode,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';
import {
  NotificationChannel,
  NotificationSourceEntity,
  NotificationType,
} from '@club-social/shared/notifications';
import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { ResendNotificationEmailTemplate } from '@/infrastructure/email/resend/resend.types';
import { MovementEntity } from '@/movements/domain/entities/movement.entity';
import { NotificationEntity } from '@/notifications/domain/entities/notification.entity';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';
import { SignedAmount } from '@/shared/domain/value-objects/amount/signed-amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

export interface CreateMovementParams {
  amount: number;
  category: MovementCategory;
  createdBy: string;
  createdByUserId: string;
  date: string;
  notes: null | string;
  type: MovementType;
}

export class CreateMovementUseCase extends UseCase<MovementEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: CreateMovementParams,
  ): Promise<Result<MovementEntity>> {
    this.logger.info({ message: 'Creating movement', params });

    const results = ResultUtils.combine([
      SignedAmount.fromCents(params.amount),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [amount, date] = results.value;

    const movement = MovementEntity.create(
      {
        amount:
          params.type === MovementType.INFLOW ? amount : amount.toNegative(),
        category: params.category,
        date,
        mode: MovementMode.MANUAL,
        notes: params.notes,
        paymentId: null,
        status: MovementStatus.REGISTERED,
      },
      params.createdBy,
    );

    if (movement.isErr()) {
      return err(movement.error);
    }

    const subscriberNotifications = await this.createSubscriberNotifications({
      createdBy: params.createdBy,
      createdByUserId: params.createdByUserId,
      movement: movement.value,
    });

    if (subscriberNotifications.isErr()) {
      return err(subscriberNotifications.error);
    }

    await this.unitOfWork.execute(
      async ({ movementRepository, notificationRepository }) => {
        await movementRepository.save(movement.value);
        await Promise.all(
          subscriberNotifications.value.map((notification) =>
            notificationRepository.save(notification),
          ),
        );
      },
    );

    this.eventPublisher.dispatch(movement.value);
    subscriberNotifications.value.forEach((notification) =>
      this.eventPublisher.dispatch(notification),
    );

    return ok(movement.value);
  }

  private async createSubscriberNotifications(props: {
    createdBy: string;
    createdByUserId: string;
    movement: MovementEntity;
  }): Promise<Result<NotificationEntity[]>> {
    const optedInUsers =
      await this.userRepository.findWithNotifyOnMemberCreated();

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
              template: ResendNotificationEmailTemplate.MOVEMENT_CREATED,
              variables: {
                amount: NumberFormat.currencyCents(props.movement.amount.cents),
                category: MovementCategoryLabel[props.movement.category],
                createdBy: props.createdBy,
                date: DateFormat.date(props.movement.date.value),
                userName: subscriber.name.firstName,
              },
            },
            recipientAddress: subscriber.email.value,
            sourceEntity: NotificationSourceEntity.MOVEMENT,
            sourceEntityId: props.movement.id,
            type: NotificationType.MOVEMENT_CREATED,
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
