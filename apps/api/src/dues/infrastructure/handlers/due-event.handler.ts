import { DueCategory } from '@club-social/shared/dues';
import { DateFormat, NumberFormat } from '@club-social/shared/lib';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { filter, flow, sumBy } from 'es-toolkit/compat';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { DueEntity } from '@/dues/domain/entities/due.entity';
import { DueCreatedEvent } from '@/dues/domain/events/due-created.event';
import { EmailQueueService } from '@/infrastructure/email/email-queue.service';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';

@Injectable()
export class DueEventHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    private readonly emailQueueService: EmailQueueService,
  ) {
    this.logger.setContext(DueEventHandler.name);
  }

  @OnEvent(DueCreatedEvent.name)
  public async handleDueCreated(event: DueCreatedEvent): Promise<void> {
    const member = await this.memberRepository.findByIdReadModelOrThrow(
      event.due.memberId,
    );

    const pendingDues = await this.dueRepository.findPendingByMemberId(
      event.due.memberId,
    );

    const getPendingAmount = flow(
      (dues: DueEntity[], category: DueCategory) =>
        filter(dues, (due) => due.category === category),
      (dues: DueEntity[]) => sumBy(dues, (due) => due.pendingAmount.cents),
    );

    const pendingElectricity = getPendingAmount(
      pendingDues,
      DueCategory.ELECTRICITY,
    );
    const pendingGuest = getPendingAmount(pendingDues, DueCategory.GUEST);
    const pendingMembership = getPendingAmount(
      pendingDues,
      DueCategory.MEMBERSHIP,
    );
    const pendingTotal = pendingElectricity + pendingGuest + pendingMembership;

    await this.emailQueueService.sendNewDueMovement({
      amount: NumberFormat.currencyCents(event.due.amount.cents),
      category: event.due.category,
      date: DateFormat.date(event.due.date.value),
      email: member.email,
      memberName: member.firstName,
      pendingElectricity: NumberFormat.currencyCents(pendingElectricity),
      pendingGuest: NumberFormat.currencyCents(pendingGuest),
      pendingMembership: NumberFormat.currencyCents(pendingMembership),
      pendingTotal: NumberFormat.currencyCents(pendingTotal),
    });
  }
}
