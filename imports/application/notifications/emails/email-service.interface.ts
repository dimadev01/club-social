import { Result } from 'neverthrow';

import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IEmailTo } from '@domain/emails/email.interface';

export interface IEmailService {
  sendNewDue(props: FindOneById): Promise<Result<null, Error>>;
  sendNewPayment(props: FindOneById): Promise<Result<null, Error>>;
}

export interface SendNewDueRequest {
  to: IEmailTo;
  variables: { [key: string]: unknown };
}

export interface SendNewPaymentRequest {
  to: IEmailTo;
  variables: { [key: string]: unknown };
}

export interface SendTemplateRequest {
  templateId: string;
  to: IEmailTo;
  unsubscribeGroupId: number | null;
  variables: { [key: string]: unknown };
}

/**
 * For later use
 */
export interface EmailAttachment {
  content: Buffer | string;
  contentType?: string;
  filename: string;
}

export interface EmailOptions {
  attachments?: EmailAttachment[];
  from?: string;
  headers?: { [key: string]: string };
  html?: string;
  priority?: 'high' | 'normal' | 'low';
  subject: string;
  text?: string;
  to: string | string[];
}
