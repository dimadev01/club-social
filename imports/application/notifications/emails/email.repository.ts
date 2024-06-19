import { Result } from 'neverthrow';

import { IEmailTo } from '@domain/emails/email.interface';

export interface IEmailRepository {
  sendTemplate(options: EmailWithTemplateOptions): Promise<Result<null, Error>>;
}

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

export interface EmailWithTemplateOptions {
  templateId: string;
  to: IEmailTo;
  unsubscribeGroupId: number | null;
  variables: { [key: string]: unknown };
}
