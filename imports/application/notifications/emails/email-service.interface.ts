import { Result } from 'neverthrow';

export interface IEmailService {
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

export interface EmailTo {
  email: string;
  name: string;
}

export interface EmailWithTemplateOptions {
  templateId: string;
  to: EmailTo | EmailTo[];
  unsubscribeGroupId: number | null;
  variables: { [key: string]: unknown };
}
