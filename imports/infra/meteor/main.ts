import 'reflect-metadata';
import '@infra/di/di.container';
import '@infra/meteor/common/meteor-publications';
import { Meteor } from 'meteor/meteor';
import { container } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { EmailServiceEnum } from '@application/notifications/emails/email.enum';
import { UserStateEnum } from '@domain/users/user.enum';
import { UserMethodOld } from '@domain/users/user.methods';
import { DueMethods } from '@infra/meteor/methods/due.methods';
import { EventMethods } from '@infra/meteor/methods/event.methods';
import { MemberMethods } from '@infra/meteor/methods/member.methods';
import { MovementMethods } from '@infra/meteor/methods/movement.methods';
import { PaymentMethods } from '@infra/meteor/methods/payment.methods';
import { MigrationService } from '@infra/migrations/migration.service';

export class ServerStartup {
  public async start() {
    this._configureEmails();

    this._migrate();

    this._registerMethods();

    await this._createUsersIndexes();

    this._configureValidateLoginAttempt();

    if (Meteor.isProduction) {
      container
        .resolve<ILoggerService>(DIToken.ILoggerService)
        .info('Server startup completed');
    }
  }

  private _configureEmails() {
    Accounts.emailTemplates.siteName = 'Club Social Monte Grande';

    Accounts.emailTemplates.from = `${EmailServiceEnum.EMAIL_FORM_NAME} ${EmailServiceEnum.EMAIL_FROM_ADDRESS}`;

    Accounts.emailTemplates.verifyEmail.html = (
      user: Meteor.User,
      url: string,
    ) => {
      const urlWithoutHashtag = url.replace('#/', '');

      return `Hola ${user.profile?.firstName} ${user.profile?.lastName}, verifica tu cuenta: <a href="${urlWithoutHashtag}">${urlWithoutHashtag}</a>`;
    };

    Accounts.emailTemplates.enrollAccount.html = (
      user: Meteor.User,
      url: string,
    ) => {
      const urlWithoutHashtag = url.replace('#/', '');

      return `Hola ${user.profile?.firstName} ${user.profile?.lastName}, activa tu cuenta: <a href="${urlWithoutHashtag}">${urlWithoutHashtag}</a>`;
    };
  }

  private _configureValidateLoginAttempt() {
    Accounts.validateLoginAttempt(
      (attempt: { user: Meteor.User & { isActive: boolean } }) => {
        if (attempt.user?.profile?.state === UserStateEnum.INACTIVE) {
          return false;
        }

        return true;
      },
    );
  }

  private async _createUsersIndexes() {
    await Meteor.users.createIndexAsync({ createdAt: -1 });

    await Meteor.users.createIndexAsync({ 'profile.firstName': 1 });

    await Meteor.users.createIndexAsync({ 'profile.lastName': 1 });

    await Meteor.users.createIndexAsync({ 'profile.role': 1 });
  }

  private _migrate() {
    new MigrationService().start();
  }

  private async _registerMethods() {
    new UserMethodOld().register();

    new MovementMethods().register();

    new PaymentMethods().register();

    new MemberMethods().register();

    new DueMethods().register();

    new EventMethods().register();
  }
}

Meteor.startup(async () => {
  try {
    await new ServerStartup().start();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    process.exit(1);
  }
});
