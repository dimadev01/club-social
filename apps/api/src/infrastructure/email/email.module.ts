import { Module } from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { EMAIL_PROVIDER_PROVIDER } from './email.provider';
import { EmailService } from './email.service';
import { NodemailerProvider } from './nodemailer/nodemailer.service';
import { ResendProvider } from './resend/resend.service';

@Module({
  exports: [EmailService],
  imports: [],
  providers: [
    EmailService,
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
