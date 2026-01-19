import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@club-social/shared/notifications';

import { AuditedAggregateRoot } from '@/shared/domain/audited-aggregate-root';
import { PersistenceMeta } from '@/shared/domain/persistence-meta';
import { ok, Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { StrictOmit } from '@/shared/types/type-utils';

const DEFAULT_MAX_ATTEMPTS = 3;

export type CreateNotificationProps = StrictOmit<
  NotificationProps,
  | 'attempts'
  | 'deliveredAt'
  | 'lastError'
  | 'maxAttempts'
  | 'processedAt'
  | 'providerMessageId'
  | 'queuedAt'
  | 'scheduledAt'
  | 'sentAt'
  | 'status'
>;

export interface NotificationProps {
  attempts: number;
  channel: NotificationChannel;
  deliveredAt: Date | null;
  lastError: null | string;
  maxAttempts: number;
  payload: Record<string, unknown>;
  processedAt: Date | null;
  providerMessageId: null | string;
  queuedAt: Date | null;
  recipientAddress: string;
  scheduledAt: Date | null;
  sentAt: Date | null;
  sourceEntity: null | string;
  sourceEntityId: null | UniqueId;
  status: NotificationStatus;
  type: NotificationType;
  userId: UniqueId;
}

export class NotificationEntity extends AuditedAggregateRoot {
  public get attempts(): number {
    return this._attempts;
  }

  public get channel(): NotificationChannel {
    return this._channel;
  }

  public get deliveredAt(): Date | null {
    return this._deliveredAt;
  }

  public get lastError(): null | string {
    return this._lastError;
  }

  public get maxAttempts(): number {
    return this._maxAttempts;
  }

  public get payload(): Record<string, unknown> {
    return this._payload;
  }

  public get processedAt(): Date | null {
    return this._processedAt;
  }

  public get providerMessageId(): null | string {
    return this._providerMessageId;
  }

  public get queuedAt(): Date | null {
    return this._queuedAt;
  }

  public get recipientAddress(): string {
    return this._recipientAddress;
  }

  public get scheduledAt(): Date | null {
    return this._scheduledAt;
  }

  public get sentAt(): Date | null {
    return this._sentAt;
  }

  public get sourceEntity(): null | string {
    return this._sourceEntity;
  }

  public get sourceEntityId(): null | UniqueId {
    return this._sourceEntityId;
  }

  public get status(): NotificationStatus {
    return this._status;
  }

  public get type(): NotificationType {
    return this._type;
  }

  public get userId(): UniqueId {
    return this._userId;
  }

  private _attempts: number;
  private _channel: NotificationChannel;
  private _deliveredAt: Date | null;
  private _lastError: null | string;
  private _maxAttempts: number;
  private _payload: Record<string, unknown>;
  private _processedAt: Date | null;
  private _providerMessageId: null | string;
  private _queuedAt: Date | null;
  private _recipientAddress: string;
  private _scheduledAt: Date | null;
  private _sentAt: Date | null;
  private _sourceEntity: null | string;
  private _sourceEntityId: null | UniqueId;
  private _status: NotificationStatus;
  private _type: NotificationType;
  private _userId: UniqueId;

  private constructor(props: NotificationProps, meta?: PersistenceMeta) {
    super(meta?.id, meta?.audit);

    this._attempts = props.attempts;
    this._channel = props.channel;
    this._deliveredAt = props.deliveredAt;
    this._lastError = props.lastError;
    this._maxAttempts = props.maxAttempts;
    this._userId = props.userId;
    this._payload = props.payload;
    this._processedAt = props.processedAt;
    this._providerMessageId = props.providerMessageId;
    this._queuedAt = props.queuedAt;
    this._recipientAddress = props.recipientAddress;
    this._scheduledAt = props.scheduledAt;
    this._sentAt = props.sentAt;
    this._sourceEntity = props.sourceEntity;
    this._sourceEntityId = props.sourceEntityId;
    this._status = props.status;
    this._type = props.type;
  }

  public static create(
    props: CreateNotificationProps,
    createdBy: string,
  ): Result<NotificationEntity> {
    const notification = new NotificationEntity(
      {
        attempts: 0,
        channel: props.channel,
        deliveredAt: null,
        lastError: null,
        maxAttempts: DEFAULT_MAX_ATTEMPTS,
        payload: props.payload,
        processedAt: null,
        providerMessageId: null,
        queuedAt: null,
        recipientAddress: props.recipientAddress,
        scheduledAt: null,
        sentAt: null,
        sourceEntity: props.sourceEntity,
        sourceEntityId: props.sourceEntityId,
        status: NotificationStatus.PENDING,
        type: props.type,
        userId: props.userId,
      },
      {
        audit: { createdBy },
        id: UniqueId.generate(),
      },
    );

    return ok(notification);
  }

  public static fromPersistence(
    props: NotificationProps,
    meta: PersistenceMeta,
  ): NotificationEntity {
    return new NotificationEntity(props, meta);
  }

  public canRetry(): boolean {
    return this._attempts < this._maxAttempts;
  }

  public fail(error: string, updatedBy: string): void {
    this._lastError = error;
    this.markAsUpdated(updatedBy);
  }

  public isBounced(): boolean {
    return this._status === NotificationStatus.BOUNCED;
  }

  public isDelivered(): boolean {
    return this._status === NotificationStatus.DELIVERED;
  }

  public isFailed(): boolean {
    return this._status === NotificationStatus.FAILED;
  }

  public isPending(): boolean {
    return this._status === NotificationStatus.PENDING;
  }

  public isProcessing(): boolean {
    return this._status === NotificationStatus.PROCESSING;
  }

  public isQueued(): boolean {
    return this._status === NotificationStatus.QUEUED;
  }

  public isSent(): boolean {
    return this._status === NotificationStatus.SENT;
  }

  public isSuppressed(): boolean {
    return this._status === NotificationStatus.SUPPRESSED;
  }

  public markAsBounced(error: string, updatedBy: string): void {
    this._status = NotificationStatus.BOUNCED;
    this._lastError = error;
    this.markAsUpdated(updatedBy);
  }

  public markAsDelivered(updatedBy: string): void {
    this._status = NotificationStatus.DELIVERED;
    this._deliveredAt = new Date();
    this.markAsUpdated(updatedBy);
  }

  public markAsFailed(error: string, updatedBy: string): void {
    this._lastError = error;
    this._status = NotificationStatus.FAILED;
    this.markAsUpdated(updatedBy);
  }

  public markAsProcessing(updatedBy: string): void {
    this._status = NotificationStatus.PROCESSING;
    this._processedAt = new Date();
    this._attempts += 1;
    this.markAsUpdated(updatedBy);
  }

  public markAsQueued(updatedBy: string): void {
    this._status = NotificationStatus.QUEUED;
    this._queuedAt = new Date();
    this.markAsUpdated(updatedBy);
  }

  public markAsSent(providerMessageId: string, updatedBy: string): void {
    this._status = NotificationStatus.SENT;
    this._providerMessageId = providerMessageId;
    this._sentAt = new Date();
    this.markAsUpdated(updatedBy);
  }

  public markAsSuppressed(reason: string, updatedBy: string): void {
    this._status = NotificationStatus.SUPPRESSED;
    this._lastError = reason;
    this.markAsUpdated(updatedBy);
  }
}
