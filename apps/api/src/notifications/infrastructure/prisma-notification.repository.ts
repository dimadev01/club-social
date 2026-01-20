import type {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@club-social/shared/notifications';
import { Injectable } from '@nestjs/common';

import type {
  NotificationFindManyArgs,
  NotificationGetPayload,
  NotificationOrderByWithRelationInput,
  NotificationWhereInput,
} from '@/infrastructure/database/prisma/generated/models/Notification';

import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { PrismaClientLike } from '@/infrastructure/database/prisma/prisma.types';
import { EntityNotFoundError } from '@/shared/domain/errors/entity-not-found.error';
import { Name } from '@/shared/domain/value-objects/name/name.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type {
  NotificationPaginatedReadModel,
  NotificationReadModel,
} from '../domain/notification-read-models';

import { NotificationEntity } from '../domain/entities/notification.entity';
import { NotificationRepository } from '../domain/notification.repository';
import { PrismaNotificationMapper } from './prisma-notification.mapper';

type NotificationWithUserPayload = NotificationGetPayload<{
  include: { user: true };
}>;

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationMapper: PrismaNotificationMapper,
  ) {}

  public async findById(id: UniqueId): Promise<NotificationEntity | null> {
    const notification = await this.prismaService.notification.findUnique({
      where: { id: id.value },
    });

    return notification ? this.notificationMapper.toDomain(notification) : null;
  }

  public async findByIdOrThrow(id: UniqueId): Promise<NotificationEntity> {
    const notification = await this.findById(id);

    if (!notification) {
      throw new EntityNotFoundError();
    }

    return notification;
  }

  public async findByIdReadModel(
    id: UniqueId,
  ): Promise<NotificationReadModel | null> {
    const notification = await this.prismaService.notification.findUnique({
      include: { user: true },
      where: { id: id.value },
    });

    return notification ? this.toReadModel(notification) : null;
  }

  public async findByIds(ids: UniqueId[]): Promise<NotificationEntity[]> {
    const notifications = await this.prismaService.notification.findMany({
      where: { id: { in: ids.map((id) => id.value) } },
    });

    return notifications.map((notification) =>
      this.notificationMapper.toDomain(notification),
    );
  }

  public async findByProviderMessageId(
    messageId: string,
  ): Promise<NotificationEntity | null> {
    const notification = await this.prismaService.notification.findFirst({
      where: { providerMessageId: messageId },
    });

    return notification ? this.notificationMapper.toDomain(notification) : null;
  }

  public async findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<PaginatedDataResultDto<NotificationPaginatedReadModel>> {
    const { orderBy, where } = this.buildWhereAndOrderBy(params);

    const query = {
      include: { user: true },
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      where,
    } satisfies NotificationFindManyArgs;

    const [notifications, total] = await Promise.all([
      this.prismaService.notification.findMany(query),
      this.prismaService.notification.count({ where }),
    ]);

    return {
      data: notifications.map((n) => this.toPaginatedReadModel(n)),
      total,
    };
  }

  public async findPendingForProcessing(
    limit: number,
  ): Promise<NotificationEntity[]> {
    const notifications = await this.prismaService.notification.findMany({
      orderBy: { createdAt: 'asc' },
      take: limit,
      where: {
        OR: [{ scheduledAt: null }, { scheduledAt: { lte: new Date() } }],
        status: NotificationStatus.PENDING,
      },
    });

    return notifications.map((notification) =>
      this.notificationMapper.toDomain(notification),
    );
  }

  public async save(
    entity: NotificationEntity,
    tx?: PrismaClientLike,
  ): Promise<void> {
    const client = tx ?? this.prismaService;

    const create = this.notificationMapper.toCreateInput(entity);
    const update = this.notificationMapper.toUpdateInput(entity);

    await client.notification.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }

  private buildWhereAndOrderBy(params: GetPaginatedDataDto): {
    orderBy: NotificationOrderByWithRelationInput[];
    where: NotificationWhereInput;
  } {
    const where: NotificationWhereInput = {};

    if (params.filters?.channel) {
      where.channel = { in: params.filters.channel };
    }

    if (params.filters?.type) {
      where.type = { in: params.filters.type };
    }

    if (params.filters?.status) {
      where.status = { in: params.filters.status };
    }

    const orderBy: NotificationOrderByWithRelationInput[] = [
      ...params.sort.map(({ field, order }) => ({ [field]: order })),
      { createdAt: 'desc' },
    ];

    return { orderBy, where };
  }

  private toPaginatedReadModel(
    model: NotificationWithUserPayload,
  ): NotificationPaginatedReadModel {
    return {
      channel: model.channel as NotificationChannel,
      createdAt: model.createdAt,
      id: model.id,
      recipientAddress: model.recipientAddress,
      status: model.status as NotificationStatus,
      type: model.type as NotificationType,
      userName: Name.raw({
        firstName: model.user.firstName,
        lastName: model.user.lastName,
      }).fullName,
    };
  }

  private toReadModel(
    model: NotificationWithUserPayload,
  ): NotificationReadModel {
    return {
      attempts: model.attempts,
      channel: model.channel as NotificationChannel,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      deliveredAt: model.deliveredAt,
      id: model.id,
      lastError: model.lastError,
      maxAttempts: model.maxAttempts,
      payload: model.payload as Record<string, unknown>,
      processedAt: model.processedAt,
      providerMessageId: model.providerMessageId,
      queuedAt: model.queuedAt,
      recipientAddress: model.recipientAddress,
      scheduledAt: model.scheduledAt,
      sentAt: model.sentAt,
      sourceEntity: model.sourceEntity,
      sourceEntityId: model.sourceEntityId,
      status: model.status as NotificationStatus,
      type: model.type as NotificationType,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      userId: model.userId,
      userName: Name.raw({
        firstName: model.user.firstName,
        lastName: model.user.lastName,
      }).fullName,
    };
  }
}
