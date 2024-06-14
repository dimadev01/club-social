import { Result } from 'neverthrow';

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

export interface Email {
  email: string;
  name: string;
}

export interface TemplateEmailOptions {
  templateId: string;
  to: Email | Email[];
  unsubscribeGroupId: number | null;
  variables: { [key: string]: unknown };
}

export interface IEmailService {
  // sendBatchEmails(options: EmailOptions[]): Promise<void>;
  // sendEmail(options: EmailOptions): Promise<Result<null, Error>>;
  sendTemplateEmail(
    options: TemplateEmailOptions,
  ): Promise<Result<null, Error>>;
}
