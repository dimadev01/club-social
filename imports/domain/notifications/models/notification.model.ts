import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import {
  CreateNotification,
  INotification,
  INotificationActionEnum,
  INotificationEntityEnum,
  INotificationStatusEnum,
} from '@domain/notifications/notification.interface';

export class Notification extends Model implements INotification {
  private _action: INotificationActionEnum;

  private _actorId: string;

  private _actorName: string;

  private _message: string;

  private _readAt: Date | null;

  private _receiverId: string;

  private _receiverName: string;

  private _resourceId: string;

  private _status: INotificationStatusEnum;

  private _subject: string;

  private _type: INotificationEntityEnum;

  public constructor(props?: INotification) {
    super(props);

    this._actorId = props?.actorId ?? '';

    this._actorName = props?.actorName ?? '';

    this._message = props?.message ?? '';

    this._receiverId = props?.receiverId ?? '';

    this._receiverName = props?.receiverName ?? '';

    this._subject = props?.subject ?? '';

    this._status = props?.status ?? INotificationStatusEnum.UNREAD;

    this._readAt = props?.readAt ?? null;

    this._action = props?.action ?? INotificationActionEnum.CREATION;

    this._resourceId = props?.resourceId ?? '';

    this._type = props?.type ?? INotificationEntityEnum.DUE;
  }

  public get action(): INotificationActionEnum {
    return this._action;
  }

  public get actorId(): string {
    return this._actorId;
  }

  public get actorName(): string {
    return this._actorName;
  }

  public get message(): string {
    return this._message;
  }

  public get readAt(): Date | null {
    return this._readAt;
  }

  public get receiverId(): string {
    return this._receiverId;
  }

  public get receiverName(): string {
    return this._receiverName;
  }

  public get resourceId(): string {
    return this._resourceId;
  }

  public get status(): INotificationStatusEnum {
    return this._status;
  }

  public get subject(): string {
    return this._subject;
  }

  public get type(): INotificationEntityEnum {
    return this._type;
  }

  public static create(props: CreateNotification): Result<Notification, Error> {
    const notification = new Notification();

    const result = Result.combine([
      notification.setActorId(props.actorId),
      notification.setActorName(props.actorName),
      notification.setMessage(props.message),
      notification.setReceiverId(props.receiverId),
      notification.setReceiverName(props.receiverName),
      notification.setSubject(props.subject),
      notification.setStatus(INotificationStatusEnum.UNREAD),
      notification.setReadAt(null),
      notification.setAction(props.action),
      notification.setResourceId(props.receiverId),
      notification.setType(props.type),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(notification);
  }

  private setAction(value: INotificationActionEnum): Result<null, Error> {
    this._action = value;

    return ok(null);
  }

  private setActorId(value: string): Result<null, Error> {
    this._actorId = value;

    return ok(null);
  }

  private setActorName(value: string): Result<null, Error> {
    this._actorName = value;

    return ok(null);
  }

  private setMessage(value: string): Result<null, Error> {
    this._message = value;

    return ok(null);
  }

  private setReadAt(value: Date | null): Result<null, Error> {
    this._readAt = value;

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

  private setStatus(value: INotificationStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }

  private setSubject(value: string): Result<null, Error> {
    this._subject = value;

    return ok(null);
  }

  private setType(value: INotificationEntityEnum): Result<null, Error> {
    this._type = value;

    return ok(null);
  }
}
