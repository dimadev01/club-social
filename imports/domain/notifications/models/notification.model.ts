import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import {
  NotificationResourceEnum,
  NotificationStatusEnum,
} from '@domain/notifications/notification.enum';
import {
  CreateNotification,
  INotification,
} from '@domain/notifications/notification.interface';

export class Notification extends Model implements INotification {
  private _message: string;

  private _readAt: DateTimeVo | null;

  private _receiverId: string;

  private _receiverName: string;

  private _resource: NotificationResourceEnum;

  private _resourceId: string;

  private _status: NotificationStatusEnum;

  private _subject: string;

  public constructor(props?: INotification) {
    super(props);

    this._message = props?.message ?? '';

    this._receiverId = props?.receiverId ?? '';

    this._receiverName = props?.receiverName ?? '';

    this._subject = props?.subject ?? '';

    this._status = props?.status ?? NotificationStatusEnum.UNREAD;

    this._readAt = props?.readAt ?? new DateTimeVo();

    this._resourceId = props?.resourceId ?? '';

    this._resource = props?.resource ?? NotificationResourceEnum.DUE;
  }

  public get message(): string {
    return this._message;
  }

  public get readAt(): DateTimeVo | null {
    return this._readAt;
  }

  public get receiverId(): string {
    return this._receiverId;
  }

  public get receiverName(): string {
    return this._receiverName;
  }

  public get resource(): NotificationResourceEnum {
    return this._resource;
  }

  public get resourceId(): string {
    return this._resourceId;
  }

  public get status(): NotificationStatusEnum {
    return this._status;
  }

  public get subject(): string {
    return this._subject;
  }

  public static create(props: CreateNotification): Result<Notification, Error> {
    const notification = new Notification();

    const result = Result.combine([
      notification.setMessage(props.message),
      notification.setReceiverId(props.receiverId),
      notification.setReceiverName(props.receiverName),
      notification.setSubject(props.subject),
      notification.setStatus(NotificationStatusEnum.UNREAD),
      notification.setResourceId(props.receiverId),
      notification.setResource(props.resource),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(notification);
  }

  private setMessage(value: string): Result<null, Error> {
    this._message = value;

    return ok(null);
  }

  private setReceiverId(value: string): Result<null, Error> {
    this._receiverId = value;

    return ok(null);
  }

  private setReceiverName(value: string): Result<null, Error> {
    this._receiverName = value;

    return ok(null);
  }

  private setResourceId(value: string): Result<null, Error> {
    this._resourceId = value;

    return ok(null);
  }

  private setStatus(value: NotificationStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }

  private setSubject(value: string): Result<null, Error> {
    this._subject = value;

    return ok(null);
  }

  private setResource(value: NotificationResourceEnum): Result<null, Error> {
    this._resource = value;

    return ok(null);
  }
}
