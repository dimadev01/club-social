import { DueCategory, DueCategoryLabel } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import {
  NotificationChannel,
  NotificationType,
} from '@club-social/shared/notifications';
import { Inject } from '@nestjs/common';
import { filter, flow, sumBy } from 'es-toolkit/compat';

import type { Result } from '@/shared/domain/result';

import { DueEntity } from '@/dues/domain/entities/due.entity';
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

export class CreateDueUseCase extends UseCase<DueEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
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

    let notification: NotificationEntity | null = null;

    if (member.notificationPreferences.notifyOnDueCreated) {
      const pendingDues = await this.dueRepository.findPendingByMemberId(
        UniqueId.raw({ value: params.memberId }),
      );

      const allPendingDues = [...pendingDues, due.value];

      const getPendingAmount = flow(
        (dues: DueEntity[], category: DueCategory) =>
          filter(dues, (d) => d.category === category),
        (dues: DueEntity[]) => sumBy(dues, (d) => d.pendingAmount.cents),
      );

      const pendingElectricity = getPendingAmount(
        allPendingDues,
        DueCategory.ELECTRICITY,
      );
      const pendingGuest = getPendingAmount(allPendingDues, DueCategory.GUEST);
      const pendingMembership = getPendingAmount(
        allPendingDues,
        DueCategory.MEMBERSHIP,
      );
      const pendingTotal =
        pendingElectricity + pendingGuest + pendingMembership;

      const notificationResult = NotificationEntity.create(
        {
          channel: NotificationChannel.EMAIL,
          memberId: UniqueId.raw({ value: params.memberId }),
          payload: {
            template: 'new-movement',
            variables: {
              amount: NumberFormat.currencyCents(params.amount),
              category: DueCategoryLabel[params.category],
              date: DateFormat.date(date.value),
              memberName: member.firstName,
              pendingElectricity:
                NumberFormat.currencyCents(pendingElectricity),
              pendingGuest: NumberFormat.currencyCents(pendingGuest),
              pendingMembership: NumberFormat.currencyCents(pendingMembership),
              pendingTotal: NumberFormat.currencyCents(pendingTotal),
            },
          },
          recipientAddress: member.email,
          sourceEntity: 'due',
          sourceEntityId: due.value.id,
          type: NotificationType.DUE_CREATED,
        },
        params.createdBy,
      );

      if (notificationResult.isOk()) {
        notification = notificationResult.value;
      }
    }

    await this.unitOfWork.execute(async (repos) => {
      await repos.duesRepository.save(due.value);

      if (notification) {
        await repos.notificationRepository.save(notification);
      }
    });

    this.eventPublisher.dispatch(due.value);

    return ok(due.value);
  }
}
