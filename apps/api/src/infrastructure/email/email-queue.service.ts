import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { SendMagicLinkParams } from './email.types';

@Injectable()
export class EmailQueueService {
  public constructor(
    @InjectQueue('email')
    private readonly queue: Queue,
  ) {}

  public async magicLink(params: SendMagicLinkParams): Promise<void> {
    await this.queue.add('send-magic-link', params);
  }
}
