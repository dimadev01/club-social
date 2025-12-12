import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { SendMagicLinkParams } from './email.types';

@Injectable()
export class EmailQueueService {
  public constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  public async enqueueMagicLink(params: SendMagicLinkParams): Promise<void> {
    await this.emailQueue.add('send-magic-link', params);
  }
}
