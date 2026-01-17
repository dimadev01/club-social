export type EmailCriticalJobData =
  | { data: SendMagicLinkParams; type: 'send-magic-link' }
  | { data: SendVerificationEmailParams; type: 'send-verification-email' };

export interface EmailSendResult {
  id: string;
}

export interface SendEmailParams {
  from?: string;
  html: string;
  replyTo?: string;
  subject: string;
  text?: string;
  to: string;
}

export interface SendMagicLinkParams {
  email: string;
  url: string;
}

export interface SendTemplateEmailParams {
  email: string;
  template: string;
  variables: Record<string, string>;
}

export interface SendVerificationEmailParams {
  email: string;
  url: string;
}
