import type {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import type { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type { NotificationEntity } from './entities/notification.entity';
import type {
  NotificationPaginatedReadModel,
  NotificationReadModel,
} from './notification-read-models';

export const NOTIFICATION_REPOSITORY_PROVIDER = Symbol(
  'NotificationRepository',
);

export interface NotificationRepository
  extends
    PaginatedRepository<NotificationPaginatedReadModel>,
    ReadableRepository<NotificationEntity>,
    WriteableRepository<NotificationEntity> {
  findByIdReadModel(id: UniqueId): Promise<NotificationReadModel | null>;
  findByProviderMessageId(
    messageId: string,
  ): Promise<NotificationEntity | null>;
  findPendingForProcessing(limit: number): Promise<NotificationEntity[]>;
}
