import { IEmailService } from '@application/notifications/email.interface';
import {
  SendEmailRequest,
  SendEmailResponse,
} from '@application/notifications/email.types';
import { AppConstants } from '@ui/app.enum';

export class EmailService implements IEmailService {
  public async send(request: SendEmailRequest): Promise<SendEmailResponse> {
    Email.send({
      from: AppConstants.EmailFrom,
      html: request.message,
      text: request.message,
      to: request.to,
    });

    return {
      success: true,
    };
  }
}
