import { DateUtils } from '@club-social/shared/lib';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { DelayedError, Job } from 'bullmq';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { Email } from '@/shared/domain/value-objects/email/email.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

import {
  EmailCategory,
  EmailRateLimitService,
} from './email-rate-limit.service';
import { QueueEmailType } from './email.enum';
import { EMAIL_PROVIDER_PROVIDER, type EmailProvider } from './email.provider';
import {
  EmailCriticalJobData,
  SendMagicLinkParams,
  SendVerificationEmailParams,
} from './email.types';

@Processor('email-critical', {
  limiter: {
    duration: 5_000, // 5 seconds
    max: 1,
  },
})
export class EmailCriticalQueueProcessor extends WorkerHost {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(EMAIL_PROVIDER_PROVIDER)
    private readonly emailProvider: EmailProvider,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly emailRateLimitService: EmailRateLimitService,
  ) {
    super();
    this.logger.setContext(EmailCriticalQueueProcessor.name);
  }

  public async process(
    job: Job<EmailCriticalJobData, void, QueueEmailType>,
  ): Promise<void> {
    const { allowed, count, limit } =
      await this.emailRateLimitService.incrementAndCheck(
        EmailCategory.CRITICAL,
      );

    if (!allowed) {
      this.logger.warn({
        count,
        limit,
        message: 'Daily critical email limit reached',
      });

      const delayMs = DateUtils.getDelayUntilMidnight();
      await job.moveToDelayed(Date.now() + delayMs, job.token);

      throw new DelayedError();
    }

    switch (job.data.type) {
      case QueueEmailType.SEND_MAGIC_LINK:
        return this.handleMagicLink(job.data.data);
      case QueueEmailType.SEND_VERIFICATION_EMAIL:
        return this.handleVerificationEmail(job.data.data);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleMagicLink(data: SendMagicLinkParams): Promise<void> {
    const user = await this.userRepository.findUniqueByEmailOrThrow(
      Email.raw({ value: data.email }),
    );

    await this.emailProvider.sendTemplate({
      email: data.email,
      template: 'magic-link',
      variables: {
        url: data.url,
        userName: user.name.firstName,
      },
    });
  }

  private async handleVerificationEmail(
    data: SendVerificationEmailParams,
  ): Promise<void> {
    const user = await this.userRepository.findByIdOrThrow(
      UniqueId.raw({ value: data.userId }),
    );

    await this.emailProvider.sendTemplate({
      email: data.email,
      template: 'email-verification',
      variables: {
        url: data.url,
        userName: user.name.firstName,
      },
    });
  }
}
