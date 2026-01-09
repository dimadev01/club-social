import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { QueueEmailType } from './email.enum';
import {
  EmailCriticalJobData,
  EmailRegularJobData,
  SendMagicLinkParams,
  SendNewDueMovementParams,
  SendNewPaymentParams,
  SendVerificationEmailParams,
} from './email.types';

@Injectable()
export class EmailQueueService {
  public constructor(
    @InjectQueue('email-critical')
    private readonly criticalQueue: Queue<
      EmailCriticalJobData,
      void,
      QueueEmailType
    >,
    @InjectQueue('email-regular')
    private readonly regularQueue: Queue<
      EmailRegularJobData,
      void,
      QueueEmailType
    >,
  ) {}

  public async magicLink(params: SendMagicLinkParams) {
    await this.criticalQueue.add(QueueEmailType.SEND_MAGIC_LINK, {
      data: params,
      type: QueueEmailType.SEND_MAGIC_LINK,
    });
  }

  public async sendNewDueMovement(params: SendNewDueMovementParams) {
    await this.regularQueue.add(QueueEmailType.SEND_NEW_DUE_MOVEMENT, {
      data: params,
      type: QueueEmailType.SEND_NEW_DUE_MOVEMENT,
    });
  }

  public async sendNewPayment(params: SendNewPaymentParams) {
    await this.regularQueue.add(QueueEmailType.SEND_NEW_PAYMENT, {
      data: params,
      type: QueueEmailType.SEND_NEW_PAYMENT,
    });
  }

  public async sendVerificationEmail(params: SendVerificationEmailParams) {
    await this.criticalQueue.add(QueueEmailType.SEND_VERIFICATION_EMAIL, {
      data: params,
      type: QueueEmailType.SEND_VERIFICATION_EMAIL,
    });
  }
}
