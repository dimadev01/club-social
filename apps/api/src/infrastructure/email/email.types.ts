export type EmailJobData =
  | { data: SendMagicLinkParams; type: 'send-magic-link' }
  | { data: SendVerificationEmailParams; type: 'send-verification-email' };

export interface SendEmailParams {
  from?: string;
  html: string;
  replyTo?: string;
  subject: string;
  text?: string;
  to: string | string[];
}

export interface SendMagicLinkParams {
  email: string;
  url: string;
}

export interface SendVerificationEmailParams {
  email: string;
  url: string;
}
