import { Module } from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { QueueModule } from '../queue/queue.module';
import { EmailQueueService } from './email-queue.service';
import { EmailProcessor } from './email.processor';
import { EMAIL_PROVIDER_PROVIDER } from './email.provider';
import { NodemailerProvider } from './nodemailer/nodemailer.service';
import { ResendProvider } from './resend/resend.service';

@Module({
  exports: [EmailQueueService],
  imports: [QueueModule],
  providers: [
    EmailQueueService,
    EmailProcessor,
    NodemailerProvider,
    ResendProvider,
    {
      inject: [ConfigService, NodemailerProvider, ResendProvider],
      provide: EMAIL_PROVIDER_PROVIDER,
      useFactory: (
        configService: ConfigService,
        nodemailerService: NodemailerProvider,
        resendService: ResendProvider,
      ) => {
        if (configService.isLocal) {
          return nodemailerService;
        }

        return resendService;
      },
    },
  ],
})
export class EmailModule {}
