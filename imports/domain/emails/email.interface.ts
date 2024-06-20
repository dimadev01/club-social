import { IModel } from '@domain/common/models/model.interface';
import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { EmailVo } from '@domain/common/value-objects/email.value-object';
import { EmailEventTypeEnum, EmailStatusEnum } from '@domain/emails/email.enum';

export interface IEmail extends IModel {
  deliveredAt: Date | null;
  events: IEmailEvent[];
  from: IEmailTo;
  sentAt: Date | null;
  status: EmailStatusEnum;
  templateId: string | null;
  to: IEmailTo;
  unsubscribeGroupID: string | null;
  variables: Record<string, unknown> | null;
}

export interface IEmailTo {
  email: EmailVo;
  name: string;
}

export interface IEmailEvent {
  timestamp: DateTimeVo;
  type: EmailEventTypeEnum;
}

export interface CreateEmail {
  from: IEmailTo;
  templateId: string;
  to: IEmailTo;
  unsubscribeGroupID: string | null;
  variables: Record<string, unknown> | null;
}
