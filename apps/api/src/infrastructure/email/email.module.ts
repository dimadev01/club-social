import { Global, Module } from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { QueueModule } from '../queue/queue.module';
import { EmailCriticalProcessor } from './email-critical.processor';
import { EmailQueueService } from './email-queue.service';
import { EmailRegularProcessor } from './email-regular.processor';
import { EMAIL_PROVIDER_PROVIDER } from './email.provider';
import { NodemailerProvider } from './nodemailer/nodemailer.service';
import { ResendProvider } from './resend/resend.service';

@Global()
@Module({
  exports: [EmailQueueService],
  imports: [QueueModule],
  providers: [
    EmailQueueService,
    EmailCriticalProcessor,
    EmailRegularProcessor,
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
