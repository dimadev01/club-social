import 'reflect-metadata';
import '@infra/di/di.container';
import '@infra/meteor/common/meteor-publications';
import { Meteor } from 'meteor/meteor';
import { container, inject, singleton } from 'tsyringe';

import { DueController } from '@adapters/controllers/due.controller';
import { MemberController } from '@adapters/controllers/member.controller';
import { PaymentController } from '@adapters/controllers/payment.controller';
import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { MovementMethod } from '@domain/movements/movement.methods';
import { UserStateEnum } from '@domain/users/user.enum';
import { UserMethodOld } from '@domain/users/user.methods';
import { MigrationService } from '@infra/migrations/migration.service';
import { DateUtils } from '@shared/utils/date.utils';

DateUtils.extend();

@singleton()
export class ServerStartup {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    private readonly _migrationService: MigrationService,
    private readonly _userMethod: UserMethodOld,
    private readonly _movementMethod: MovementMethod,
    private readonly _memberController: MemberController,
    private readonly _paymentController: PaymentController,
    private readonly _dueController: DueController,
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
    if (Meteor.isDevelopment) {
      process.env.MAIL_URL = Meteor.settings.MAIL_URL;
    }

    Accounts.emailTemplates.siteName = 'Club Social Monte Grande';

    Accounts.emailTemplates.from =
      'Club Social <info@clubsocialmontegrande.ar>';

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

    this._memberController.register();

    this._paymentController.register();

    this._dueController.register();
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
