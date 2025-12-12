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
