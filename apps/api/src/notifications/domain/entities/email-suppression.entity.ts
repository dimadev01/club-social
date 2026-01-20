import { EmailSuppressionReason } from '@club-social/shared/notifications';

import { EmailSuppressionCreatedEvent } from '@/notifications/domain/events/email-suppression-created.event';
import { AggregateRoot } from '@/shared/domain/aggregate-root';
import { ok, Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface EmailSuppressionPersistenceMeta {
  createdAt: Date;
  id: UniqueId;
}

export interface EmailSuppressionProps {
  createdBy: string;
  email: string;
  providerData: null | Record<string, unknown>;
  providerEventId: null | string;
  reason: EmailSuppressionReason;
}

export class EmailSuppressionEntity extends AggregateRoot {
  public get createdAt(): Date {
    return this._createdAt;
  }

  public get createdBy(): string {
    return this._createdBy;
  }

  public get email(): string {
    return this._email;
  }

  public get providerData(): null | Record<string, unknown> {
    return this._providerData;
  }

  public get providerEventId(): null | string {
    return this._providerEventId;
  }

  public get reason(): EmailSuppressionReason {
    return this._reason;
  }

  private _createdAt: Date;
  private _createdBy: string;
  private _email: string;
  private _providerData: null | Record<string, unknown>;
  private _providerEventId: null | string;
  private _reason: EmailSuppressionReason;

  private constructor(
    props: EmailSuppressionProps,
    meta?: EmailSuppressionPersistenceMeta,
  ) {
    super(meta?.id ?? UniqueId.generate());

    this._createdAt = meta?.createdAt ?? new Date();
    this._createdBy = props.createdBy;
    this._email = props.email;
    this._providerData = props.providerData;
    this._providerEventId = props.providerEventId;
    this._reason = props.reason;
  }

  public static create(
    props: EmailSuppressionProps,
  ): Result<EmailSuppressionEntity> {
    const suppression = new EmailSuppressionEntity(props);

    suppression.addEvent(new EmailSuppressionCreatedEvent(suppression));

    return ok(suppression);
  }

  public static fromPersistence(
    props: EmailSuppressionProps,
    meta: EmailSuppressionPersistenceMeta,
  ): EmailSuppressionEntity {
    return new EmailSuppressionEntity(props, meta);
  }
}
