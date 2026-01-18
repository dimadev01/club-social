import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { QueueEmailType } from './email.enum';
import {
  EmailCriticalJobData,
  SendMagicLinkParams,
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
  ) {}

  public async magicLink(params: SendMagicLinkParams) {
    await this.criticalQueue.add(QueueEmailType.SEND_MAGIC_LINK, {
      data: params,
      type: QueueEmailType.SEND_MAGIC_LINK,
    });
  }

  public async sendVerificationEmail(params: SendVerificationEmailParams) {
    await this.criticalQueue.add(QueueEmailType.SEND_VERIFICATION_EMAIL, {
      data: params,
      type: QueueEmailType.SEND_VERIFICATION_EMAIL,
    });
  }
}
