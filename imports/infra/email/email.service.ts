import { IEmailService } from '@application/notifications/email.interface';
import {
  SendEmailRequest,
  SendEmailResponse,
} from '@application/notifications/email.types';

export class EmailService implements IEmailService {
  public async send(request: SendEmailRequest): Promise<SendEmailResponse> {
    Email.send({
      from: 'Club Social <info@clubsocialmontegrande.ar>',
      html: 'Hello world!',
      text: 'Hello world!',
      to: request.to,
    });

    return {
      success: true,
    };
  }
}
