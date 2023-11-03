import {
  SendEmailRequest,
  SendEmailResponse,
} from '@application/notifications/email.types';

export interface IEmailService {
  send(request: SendEmailRequest): Promise<SendEmailResponse>;
}
