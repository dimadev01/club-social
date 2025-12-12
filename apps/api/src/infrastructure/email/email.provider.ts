import { SendEmailParams } from './email.types';

export const EMAIL_PROVIDER_PROVIDER = Symbol('EmailProvider');

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<void>;
}
