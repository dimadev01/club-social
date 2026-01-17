import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { EmailModule } from '@/infrastructure/email/email.module';

import { HandleDeliveryWebhookUseCase } from './application/handle-delivery-webhook.use-case';
import { NotificationQueueProcessor } from './infrastructure/notification-queue.processor';
import { OutboxWorkerProcessor } from './infrastructure/outbox-worker.processor';
import { NotificationController } from './presentation/notification.controller';
import { WebhookController } from './presentation/webhook.controller';

@Module({
  controllers: [NotificationController, WebhookController],
  imports: [ScheduleModule.forRoot(), EmailModule],
  providers: [
    HandleDeliveryWebhookUseCase,
    OutboxWorkerProcessor,
    NotificationQueueProcessor,
  ],
})
export class NotificationModule {}
