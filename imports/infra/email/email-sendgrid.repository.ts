import sendgrid from '@sendgrid/mail';
import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, singleton } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerRepository } from '@application/common/logger/logger.interface';
import { EmailServiceEnum } from '@application/notifications/emails/email.enum';
import {
  EmailWithTemplateOptions,
  IEmailRepository,
} from '@application/notifications/emails/email.repository';
import { ErrorUtils } from '@domain/common/errors/error.utils';

@singleton()
export class EmailSendGridRepository implements IEmailRepository {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILoggerRepository,
  ) {
    const apiKey = Meteor.settings.private.SENDGRID_API_KEY;

    invariant(apiKey);

    sendgrid.setApiKey(apiKey);
  }

  public async sendTemplate(
    options: EmailWithTemplateOptions,
  ): Promise<Result<null, Error>> {
    try {
      let { to } = options;

      if (Meteor.isDevelopment) {
        to = {
          email: EmailServiceEnum.EMAIL_FROM_ADDRESS,
          name: EmailServiceEnum.EMAIL_FORM_NAME,
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
        from: {
          email: EmailServiceEnum.EMAIL_FROM_ADDRESS,
          name: EmailServiceEnum.EMAIL_FORM_NAME,
        },
        mailSettings: {
          sandboxMode: {
            enable: Meteor.isDevelopment,
          },
        },
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
