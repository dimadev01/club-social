import { Global, Module } from '@nestjs/common';

import { EmailCriticalQueueProcessor } from './email-critical-queue.processor';
import { EmailQueueService } from './email-queue.service';
import { EmailRateLimitService } from './email-rate-limit.service';
import { EMAIL_PROVIDER_PROVIDER } from './email.provider';
import { NodemailerProvider } from './nodemailer/nodemailer.provider';
import { ResendProvider } from './resend/resend.provider';

@Global()
@Module({
  exports: [
    EmailQueueService,
    EmailRateLimitService,
    ResendProvider,
    EMAIL_PROVIDER_PROVIDER,
  ],
  providers: [
    EmailQueueService,
    EmailCriticalQueueProcessor,
    EmailRateLimitService,
    NodemailerProvider,
    ResendProvider,
    {
      provide: EMAIL_PROVIDER_PROVIDER,
      useClass: ResendProvider,
    },
  ],
})
export class EmailModule {}
