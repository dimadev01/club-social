import { IModel } from '@domain/common/models/model.interface';
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
}

export interface IEmailTo {
  email: EmailVo;
  name: string;
}

export interface IEmailEvent {
  timestamp: Date;
  type: EmailEventTypeEnum;
}

export interface CreateEmail {
  from: IEmailTo;
  templateId: string;
  to: IEmailTo;
}
