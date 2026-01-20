import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  NotificationChannel,
  NotificationType,
} from '@club-social/shared/notifications';
import { Inject, Injectable } from '@nestjs/common';
import { sumBy } from 'es-toolkit/compat';

import type { MemberReadModel } from '@/members/domain/member-read-models';
import type { Result } from '@/shared/domain/result';

import { DueEntity } from '@/dues/domain/entities/due.entity';
import { ResendNotificationEmailTemplate } from '@/infrastructure/email/resend/resend.types';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
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
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '../domain/due.repository';

interface CreateDueParams {
  amount: number;
  category: DueCategory;
  createdBy: string;
  date: string;
  memberId: string;
  notes: null | string;
}

@Injectable()
export class CreateDueUseCase extends UseCase<DueEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: CreateDueParams): Promise<Result<DueEntity>> {
    this.logger.info({
      message: 'Creating due',
      params,
    });

    const results = ResultUtils.combine([
      Amount.fromCents(params.amount),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [amount, date] = results.value;

    const due = DueEntity.create(
      {
        amount,
        category: params.category,
        date,
        memberId: UniqueId.raw({ value: params.memberId }),
        notes: params.notes,
      },
      params.createdBy,
    );

    if (due.isErr()) {
      return err(due.error);
    }

    const member = await this.memberRepository.findByIdReadModelOrThrow(
      UniqueId.raw({ value: params.memberId }),
    );

    const memberNotification = await this.createMemberNotification(
      due.value,
      member,
      params.createdBy,
    );

    if (memberNotification.isErr()) {
      return err(memberNotification.error);
    }

    const subscriberNotifications = await this.createSubscriberNotifications(
      due.value,
      member,
      params.createdBy,
    );

    if (subscriberNotifications.isErr()) {
      return err(subscriberNotifications.error);
    }

    await this.unitOfWork.execute(
      async ({ duesRepository, notificationRepository }) => {
        await duesRepository.save(due.value);

        await notificationRepository.save(memberNotification.value);

        await Promise.all(
          subscriberNotifications.value.map((subscriberNotification) =>
            notificationRepository.save(subscriberNotification),
          ),
        );
      },
    );

    this.eventPublisher.dispatch(due.value);
    this.eventPublisher.dispatch(memberNotification.value);
    subscriberNotifications.value.forEach((subscriberNotification) =>
      this.eventPublisher.dispatch(subscriberNotification),
    );

    return ok(due.value);
  }

  private calculatePendingByCategory(dues: DueEntity[]): {
    pendingElectricity: string;
    pendingGuest: string;
    pendingMembership: string;
    pendingTotal: string;
  } {
    const getPendingAmount = (category: DueCategory) =>
      sumBy(
        dues.filter((d) => d.category === category),
        (d) => d.pendingAmount.cents,
      );

    const electricity = getPendingAmount(DueCategory.ELECTRICITY);
    const guest = getPendingAmount(DueCategory.GUEST);
    const membership = getPendingAmount(DueCategory.MEMBERSHIP);

    return {
      pendingElectricity: NumberFormat.currencyCents(electricity),
      pendingGuest: NumberFormat.currencyCents(guest),
      pendingMembership: NumberFormat.currencyCents(membership),
      pendingTotal: NumberFormat.currencyCents(
        electricity + guest + membership,
      ),
    };
  }

  private async createMemberNotification(
    due: DueEntity,
    member: MemberReadModel,
    createdBy: string,
  ): Promise<Result<NotificationEntity>> {
    const pendingDues = await this.dueRepository.findPendingByMemberId(
      due.memberId,
    );
    const allPendingDues = [...pendingDues, due];
    const pendingByCategory = this.calculatePendingByCategory(allPendingDues);

    const result = NotificationEntity.create(
      {
        channel: NotificationChannel.EMAIL,
        payload: {
          template: ResendNotificationEmailTemplate.NEW_DUE_TO_MEMBER,
          variables: {
            amount: NumberFormat.currencyCents(due.amount.cents),
            category: DueCategoryLabel[due.category],
            date: DateFormat.date(due.date.value),
            pendingElectricity: pendingByCategory.pendingElectricity,
            pendingGuest: pendingByCategory.pendingGuest,
            pendingMembership: pendingByCategory.pendingMembership,
            pendingTotal: pendingByCategory.pendingTotal,
            userName: member.firstName,
          },
        },
        recipientAddress: member.email,
        sourceEntity: 'due',
        sourceEntityId: due.id,
        type: NotificationType.DUE_CREATED,
        userId: UniqueId.raw({ value: member.userId }),
      },
      createdBy,
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }

  private async createSubscriberNotifications(
    due: DueEntity,
    member: MemberReadModel,
    createdBy: string,
  ): Promise<Result<NotificationEntity[]>> {
    const optedInUsers = await this.userRepository.findWithNotifyOnDueCreated();

    // Exclude the member's own user to avoid duplicate notification
    const subscribers = optedInUsers.filter(
      (user) => user.id.value !== member.userId,
    );

    const result = ResultUtils.combine(
      subscribers.map((user) =>
        NotificationEntity.create(
          {
            channel: NotificationChannel.EMAIL,
            payload: {
              template: ResendNotificationEmailTemplate.NEW_DUE_TO_SUBSCRIBERS,
              variables: {
                amount: NumberFormat.currencyCents(due.amount.cents),
                category: DueCategoryLabel[due.category],
                createdBy: due.createdBy,
                date: DateFormat.date(due.date.value),
                memberName: member.name,
                userName: user.name.firstName,
              },
            },
            recipientAddress: user.email.value,
            sourceEntity: 'due',
            sourceEntityId: due.id,
            type: NotificationType.DUE_CREATED,
            userId: user.id,
          },
          createdBy,
        ),
      ),
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }
}
