import sendgrid from '@sendgrid/mail';
import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, singleton } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IEmailRepository } from '@application/emails/repositories/email.repository';
import {
  IEmailService,
  SendTemplateRequest,
} from '@application/notifications/emails/email-service.interface';
import { EmailServiceEnum } from '@application/notifications/emails/email.enum';
import { ErrorUtils } from '@domain/common/errors/error.utils';
import { EmailVo } from '@domain/common/value-objects/email.value-object';

@singleton()
export class EmailSendGridService implements IEmailService {
  public constructor(
    @inject(DIToken.ILoggerService)
    private readonly _logger: ILoggerService,
    @inject(DIToken.IEmailRepository)
    private readonly _emailRepository: IEmailRepository,
  ) {
    const apiKey = Meteor.settings.private.SENDGRID_API_KEY;

    invariant(apiKey);

    sendgrid.setApiKey(apiKey);
  }

  public async sendNewDue(request: FindOneById): Promise<Result<null, Error>> {
    const email = await this._emailRepository.findOneByIdOrThrow(request);

    invariant(email.unsubscribeGroupID);

    invariant(email.variables);

    return this._sendTemplate({
      templateId: 'd-523b01d111fe4a3798b80d9dc7a4a2f7',
      to: email.to,
      unsubscribeGroupId: +email.unsubscribeGroupID,
      variables: email.variables,
    });
  }

  public async sendNewPayment(
    request: FindOneById,
  ): Promise<Result<null, Error>> {
    const email = await this._emailRepository.findOneByIdOrThrow(request);

    invariant(email.unsubscribeGroupID);

    invariant(email.variables);

    invariant(email.templateId);

    return this._sendTemplate({
      templateId: email.templateId,
      to: email.to,
      unsubscribeGroupId: +email.unsubscribeGroupID,
      variables: email.variables,
    });
  }

  private async _sendTemplate(
    request: SendTemplateRequest,
  ): Promise<Result<null, Error>> {
    try {
      let { to } = request;

      if (Meteor.isDevelopment) {
        to = {
          email: EmailVo.from({
            address: EmailServiceEnum.EMAIL_FROM_ADDRESS,
          }),
          name: EmailServiceEnum.EMAIL_FORM_NAME,
        };

        /**
         * Comment to send emails to sendgrid in development
         */
        return ok(null);
      }

      const response = await sendgrid.send({
        asm: request.unsubscribeGroupId
          ? { groupId: request.unsubscribeGroupId }
          : undefined,
        dynamicTemplateData: request.variables,
        from: {
          email: EmailServiceEnum.EMAIL_FROM_ADDRESS,
          name: EmailServiceEnum.EMAIL_FORM_NAME,
        },
        mailSettings: {
          sandboxMode: {
            enable: Meteor.isDevelopment,
          },
        },
        templateId: request.templateId,
        to: {
          email: to.email.address,
          name: to.name,
        },
      });

      if (Meteor.isDevelopment && response[0].statusCode === 200) {
        return ok(null);
      }

      if (response[0].statusCode !== 202) {
        throw new Error(`Error sending email: ${response[0].body}`);
      }

      return ok(null);
    } catch (error) {
      this._logger.error(error, request);

      return err(ErrorUtils.unknownToError(error));
    }
  }
}
