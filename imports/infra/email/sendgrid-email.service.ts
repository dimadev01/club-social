import sendgrid from '@sendgrid/mail';
import { Result, err, ok } from 'neverthrow';
import { inject, singleton } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import {
  EmailWithTemplateOptions,
  IEmailService,
} from '@application/notifications/emails/email-service.interface';
import { ErrorUtils } from '@domain/common/errors/error.utils';
import { ILogger } from '@domain/common/logger/logger.interface';

@singleton()
export class SendGridEmailService implements IEmailService {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
  ) {
    const apiKey = process.env.SENDGRID_API_KEY;

    if (apiKey) {
      sendgrid.setApiKey(apiKey);
    }
  }

  public async sendTemplate(
    options: EmailWithTemplateOptions,
  ): Promise<Result<null, Error>> {
    try {
      let { to } = options;

      if (Meteor.isDevelopment) {
        to = {
          email: 'info@clubsocialmontegrande.ar',
          name: 'Club Social Monte Grande',
        };

        /**
         * Comment to send real emails in development
         */
        return ok(null);
      }

      const response = await sendgrid.send({
        asm: options.unsubscribeGroupId
          ? { groupId: options.unsubscribeGroupId }
          : undefined,
        dynamicTemplateData: options.variables,
        from: 'info@clubsocialmontegrande.ar',
        // mailSettings: {
        //   sandboxMode: {
        //     enable: Meteor.isDevelopment,
        //   },
        // },
        templateId: options.templateId,
        to,
      });

      if (Meteor.isDevelopment && response[0].statusCode === 200) {
        return ok(null);
      }

      if (response[0].statusCode !== 202) {
        throw new Error(`Error sending email: ${response[0].body}`);
      }

      return ok(null);
    } catch (error) {
      this._logger.error(error, options);

      return err(ErrorUtils.unknownToError(error));
    }
  }
}
