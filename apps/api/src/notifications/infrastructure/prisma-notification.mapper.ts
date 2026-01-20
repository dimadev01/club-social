import type { InputJsonValue } from '@prisma/client/runtime/client';

import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@club-social/shared/notifications';
import { Injectable } from '@nestjs/common';

import {
  NotificationCreateInput,
  NotificationGetPayload,
  NotificationUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { NotificationEntity } from '../domain/entities/notification.entity';

@Injectable()
export class PrismaNotificationMapper {
  public toCreateInput(
    notification: NotificationEntity,
  ): NotificationCreateInput {
    Guard.string(notification.createdBy);

    return {
      attempts: notification.attempts,
      channel: notification.channel,
      createdBy: notification.createdBy,
      deliveredAt: notification.deliveredAt,
      id: notification.id.value,
      lastError: notification.lastError,
      maxAttempts: notification.maxAttempts,
      payload: notification.payload as unknown as InputJsonValue,
      processedAt: notification.processedAt,
      providerMessageId: notification.providerMessageId,
      queuedAt: notification.queuedAt,
      recipientAddress: notification.recipientAddress,
      scheduledAt: notification.scheduledAt,
      sentAt: notification.sentAt,
      sourceEntity: notification.sourceEntity,
      sourceEntityId: notification.sourceEntityId?.value ?? null,
      status: notification.status,
      type: notification.type,
      user: { connect: { id: notification.userId.value } },
    };
  }

  public toDomain(
    notification: NotificationGetPayload<object>,
  ): NotificationEntity {
    return NotificationEntity.fromPersistence(
      {
        attempts: notification.attempts,
        channel: notification.channel as NotificationChannel,
        deliveredAt: notification.deliveredAt,
        lastError: notification.lastError,
        maxAttempts: notification.maxAttempts,
        payload: notification.payload as Record<string, unknown>,
        processedAt: notification.processedAt,
        providerMessageId: notification.providerMessageId,
        queuedAt: notification.queuedAt,
        recipientAddress: notification.recipientAddress,
        scheduledAt: notification.scheduledAt,
        sentAt: notification.sentAt,
        sourceEntity: notification.sourceEntity,
        sourceEntityId: notification.sourceEntityId
          ? UniqueId.raw({ value: notification.sourceEntityId })
          : null,
        status: notification.status as NotificationStatus,
        type: notification.type as NotificationType,
        userId: UniqueId.raw({ value: notification.userId }),
      },
      {
        audit: {
          createdAt: notification.createdAt,
          createdBy: notification.createdBy,
          updatedAt: notification.updatedAt,
          updatedBy: notification.updatedBy,
        },
        id: UniqueId.raw({ value: notification.id }),
      },
    );
  }

  public toUpdateInput(
    notification: NotificationEntity,
  ): NotificationUpdateInput {
    return {
      attempts: notification.attempts,
      deliveredAt: notification.deliveredAt,
      lastError: notification.lastError,
      processedAt: notification.processedAt,
      providerMessageId: notification.providerMessageId,
      queuedAt: notification.queuedAt,
      sentAt: notification.sentAt,
      status: notification.status,
      updatedBy: notification.updatedBy,
    };
  }
}
