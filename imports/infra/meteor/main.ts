import 'reflect-metadata';
import '@infra/di/di.container';
import '@infra/meteor/common/meteor-publications';
import { Meteor } from 'meteor/meteor';
import { container, inject, injectable } from 'tsyringe';

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

@injectable()
export class ServerStartup {
  public constructor(
    @inject(DIToken.ILoggerService)
    private readonly _logger: ILoggerService,
    private readonly _migrationService: MigrationService,
    private readonly _userMethod: UserMethodOld,
    private readonly _movementMethod: MovementMethods,
    private readonly _memberMethods: MemberMethods,
    private readonly _paymentMethods: PaymentMethods,
    private readonly _dueMethods: DueMethods,
    private readonly _eventMethods: EventMethods,
  ) {}

  public async start() {
    this._configureEmails();

    this._migrate();

    this._registerMethods();

    await this._createUsersIndexes();

    this._configureValidateLoginAttempt();

    // this._configureOnCreateUser();

    if (Meteor.isProduction) {
      this._logger.info('Server startup completed');
    }
  }

  private _configureEmails() {
    // if (Meteor.isDevelopment) {
    //   process.env.MAIL_URL = Meteor.settings.MAIL_URL;
    // }

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
    this._migrationService.start();
  }

  private async _registerMethods() {
    this._userMethod.register();

    this._movementMethod.register();

    this._paymentMethods.register();

    this._memberMethods.register();

    this._dueMethods.register();

    this._eventMethods.register();
  }
}

Meteor.startup(async () => {
  try {
    await container.resolve(ServerStartup).start();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    process.exit(1);
  }
});
