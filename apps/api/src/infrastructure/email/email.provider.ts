import { SendEmailParams, SendTemplateEmailParams } from './email.types';

export const EMAIL_PROVIDER_PROVIDER = Symbol('EmailProvider');

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<void>;
  sendTemplate(params: SendTemplateEmailParams): Promise<void>;
}
