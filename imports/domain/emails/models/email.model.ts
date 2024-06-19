import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { EmailStatusEnum } from '@domain/emails/email.enum';
import {
  CreateEmail,
  IEmail,
  IEmailEvent,
  IEmailTo,
} from '@domain/emails/email.interface';
import { EmailEvent } from '@domain/emails/models/email-event.model';
import { EmailTo } from '@domain/emails/models/email-to.model';

export class Email extends Model implements IEmail {
  private _deliveredAt: Date | null;

  private _events: EmailEvent[];

  private _from: EmailTo;

  private _sentAt: Date | null;

  private _status: EmailStatusEnum;

  private _templateId: string | null;

  private _to: EmailTo;

  constructor(props?: IEmail) {
    super(props);

    this._deliveredAt = props?.deliveredAt ?? null;

    this._events = props?.events.map((event) => new EmailEvent(event)) ?? [];

    this._from = new EmailTo(props?.from);

    this._sentAt = props?.sentAt ?? null;

    this._status = props?.status ?? EmailStatusEnum.PENDING;

    this._templateId = props?.templateId ?? null;

    this._to = new EmailTo(props?.to);
  }

  public get deliveredAt(): Date | null {
    return this._deliveredAt;
  }

  public get events(): IEmailEvent[] {
    return this._events;
  }

  public get from(): IEmailTo {
    return this._from;
  }

  public get sentAt(): Date | null {
    return this._sentAt;
  }

  public get status(): EmailStatusEnum {
    return this._status;
  }

  public get templateId(): string | null {
    return this._templateId;
  }

  public get to(): IEmailTo {
    return this._to;
  }

  public static create(props: CreateEmail): Result<Email, Error> {
    const emailFrom = EmailTo.createOne(props.from);

    if (emailFrom.isErr()) {
      return err(emailFrom.error);
    }

    const emailTo = EmailTo.createOne(props.to);

    if (emailTo.isErr()) {
      return err(emailTo.error);
    }

    const email = new Email();

    const result = Result.combine([
      email.setFrom(emailFrom.value),
      email.setTo(emailTo.value),
      email.setTemplateId(props.templateId),
      email.setStatus(EmailStatusEnum.PENDING),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(email);
  }

  public markDelivered(): Result<null, Error> {
    this._deliveredAt = new Date();

    return this.setStatus(EmailStatusEnum.DELIVERED);
  }

  public markSent(): Result<null, Error> {
    this._sentAt = new Date();

    return this.setStatus(EmailStatusEnum.SENT);
  }

  private setFrom(value: EmailTo): Result<null, Error> {
    this._from = value;

    return ok(null);
  }

  private setStatus(value: EmailStatusEnum): Result<null, Error> {
    this._status = value;

    return ok(null);
  }

  private setTemplateId(value: string): Result<null, Error> {
    this._templateId = value;

    return ok(null);
  }

  private setTo(value: EmailTo): Result<null, Error> {
    this._to = value;

    return ok(null);
  }
}
