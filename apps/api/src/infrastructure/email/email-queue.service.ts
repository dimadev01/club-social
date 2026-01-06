import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { QueueEmailType } from './email.enum';
import {
  EmailJobData,
  SendMagicLinkParams,
  SendNewDueMovementParams,
  SendVerificationEmailParams,
} from './email.types';

@Injectable()
export class EmailQueueService {
  public constructor(
    @InjectQueue('email')
    private readonly queue: Queue<EmailJobData, void, QueueEmailType>,
  ) {}

  public async magicLink(params: SendMagicLinkParams) {
    await this.queue.add(QueueEmailType.SEND_MAGIC_LINK, {
      data: params,
      type: QueueEmailType.SEND_MAGIC_LINK,
    });
  }

  public async sendNewDueMovement(params: SendNewDueMovementParams) {
    await this.queue.add(QueueEmailType.SEND_NEW_DUE_MOVEMENT, {
      data: params,
      type: QueueEmailType.SEND_NEW_DUE_MOVEMENT,
    });
  }

  public async sendVerificationEmail(params: SendVerificationEmailParams) {
    await this.queue.add(QueueEmailType.SEND_VERIFICATION_EMAIL, {
      data: params,
      type: QueueEmailType.SEND_VERIFICATION_EMAIL,
    });
  }
}
