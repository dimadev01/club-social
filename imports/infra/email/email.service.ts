import { IEmailService } from '@application/notifications/email.interface';
import {
  SendEmailRequest,
  SendEmailResponse,
} from '@application/notifications/email.types';
import { AppConstants } from '@ui/app.enum';

export class EmailService implements IEmailService {
  public async send(request: SendEmailRequest): Promise<SendEmailResponse> {
    return {
      success: true,
    };

    await Email.sendAsync({
      from: AppConstants.EmailFrom,
      html: request.message,
      subject: request.subject,
      text: request.message,
      to: request.to,
    });

    return {
      success: true,
    };
  }
}
