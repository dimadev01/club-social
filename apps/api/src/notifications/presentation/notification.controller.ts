import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { GetPaginatedDataRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedDataResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdReqResDto } from '@/shared/presentation/dto/param-id.dto';

import {
  NOTIFICATION_REPOSITORY_PROVIDER,
  type NotificationRepository,
} from '../domain/notification.repository';
import { OutboxWorkerProcessor } from '../infrastructure/outbox-worker.processor';
import { NotificationPaginatedResponseDto } from './dto/notification-paginated.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Controller('notifications')
export class NotificationController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(NOTIFICATION_REPOSITORY_PROVIDER)
    private readonly notificationRepository: NotificationRepository,
    private readonly outboxWorkerProcessor: OutboxWorkerProcessor,
  ) {
    super(logger);
  }

  @ApiPaginatedResponse(NotificationPaginatedResponseDto)
  @Get()
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
  ): Promise<PaginatedDataResponseDto<NotificationPaginatedResponseDto>> {
    const result = await this.notificationRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: result.data.map((notification) => ({
        channel: notification.channel,
        createdAt: notification.createdAt.toISOString(),
        id: notification.id,
        recipientAddress: notification.recipientAddress,
        status: notification.status,
        type: notification.type,
        userName: notification.userName,
      })),
      total: result.total,
    };
  }

  @Post('outbox/process')
  public async processOutbox(): Promise<void> {
    return this.outboxWorkerProcessor.processOutbox();
  }

  @Get(':id')
  public async getById(
    @Param() params: ParamIdReqResDto,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findByIdReadModel(
      UniqueId.raw({ value: params.id }),
    );

    if (!notification) {
      throw new NotFoundException();
    }

    return {
      attempts: notification.attempts,
      channel: notification.channel,
      createdAt: notification.createdAt.toISOString(),
      createdBy: notification.createdBy,
      deliveredAt: notification.deliveredAt?.toISOString() ?? null,
      id: notification.id,
      lastError: notification.lastError,
      maxAttempts: notification.maxAttempts,
      payload: notification.payload,
      processedAt: notification.processedAt?.toISOString() ?? null,
      providerMessageId: notification.providerMessageId,
      queuedAt: notification.queuedAt?.toISOString() ?? null,
      recipientAddress: notification.recipientAddress,
      scheduledAt: notification.scheduledAt?.toISOString() ?? null,
      sentAt: notification.sentAt?.toISOString() ?? null,
      sourceEntity: notification.sourceEntity,
      sourceEntityId: notification.sourceEntityId,
      status: notification.status,
      type: notification.type,
      updatedAt: notification.updatedAt.toISOString(),
      updatedBy: notification.updatedBy,
      userId: notification.userId,
      userName: notification.userName,
    };
  }
}
