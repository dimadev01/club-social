import { Global, Module } from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { EmailCriticalProcessor } from './email-critical.processor';
import { EmailQueueService } from './email-queue.service';
import { EMAIL_PROVIDER_PROVIDER } from './email.provider';
import { NodemailerProvider } from './nodemailer/nodemailer.service';
import { ResendProvider } from './resend/resend.service';

@Global()
@Module({
  exports: [EmailQueueService, EMAIL_PROVIDER_PROVIDER],

  providers: [
    EmailQueueService,
    EmailCriticalProcessor,
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
