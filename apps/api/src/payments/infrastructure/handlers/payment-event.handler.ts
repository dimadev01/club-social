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
import { EmailQueueService } from '@/infrastructure/email/email-queue.service';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import { PaymentCreatedEvent } from '@/payments/domain/events/payment-created.event';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { Guard } from '@/shared/domain/guards';

@Injectable()
export class PaymentEventHandler {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    private readonly emailQueueService: EmailQueueService,
  ) {
    this.logger.setContext(PaymentEventHandler.name);
  }

  @OnEvent(PaymentCreatedEvent.name)
  public async handlePaymentCreated(event: PaymentCreatedEvent): Promise<void> {
    const member = await this.memberRepository.findByIdReadModelOrThrow(
      event.payment.memberId,
    );

    const affectedDues = await this.dueRepository.findByIdsReadModel(
      event.payment.dueIds,
    );

    const pendingDues = await this.dueRepository.findPendingByMemberId(
      event.payment.memberId,
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

    await this.emailQueueService.sendNewPayment({
      amount: NumberFormat.currencyCents(event.payment.amount.cents),
      date: DateFormat.date(event.payment.date.value),
      dues: affectedDues.map((due) => {
        const settlement = due.dueSettlements.find(
          (settlement) => settlement.payment?.id === event.payment.id.value,
        );
        Guard.defined(settlement);

        return {
          amount: NumberFormat.currencyCents(settlement.amount),
          category: due.category,
          date: DateFormat.date(due.date),
        };
      }),
      email: member.email,
      memberName: member.firstName,
      pendingElectricity: NumberFormat.currencyCents(pendingElectricity),
      pendingGuest: NumberFormat.currencyCents(pendingGuest),
      pendingMembership: NumberFormat.currencyCents(pendingMembership),
      pendingTotal: NumberFormat.currencyCents(pendingTotal),
    });
  }
}
