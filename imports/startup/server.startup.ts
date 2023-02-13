import 'reflect-metadata';
import '@infra/publications/meteor-publications';
import '@domain/users/users.collection';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { container, singleton } from 'tsyringe';
import { UsersMethods } from '@domain/users/users.methods';
import { Logger } from '@infra/logger/logger.service';
import { MigrationsService } from '@infra/migrations/migrations.service';

@singleton()
export class ServerStartup {
  // #region Constructors (1)

  public constructor(
    private readonly _logger: Logger,
    private readonly _migrations: MigrationsService,
    private readonly _usersMethods: UsersMethods
  ) {}

  // #endregion Constructors (1)

  // #region Public Methods (1)

  public async start() {
    this._configureEmails();

    this._migrate();

    this._registerMethods();

    if (Meteor.isProduction) {
      this._logger.info('Server startup completed');
    }
  }

  // #endregion Public Methods (1)

  // #region Private Methods (4)

  private _configureEmails() {
    if (Meteor.isDevelopment) {
      process.env.MAIL_URL = Meteor.settings.MAIL_URL;
    }

    Accounts.emailTemplates.siteName = 'Club Social Monte Grande';

    Accounts.emailTemplates.from =
      'Club Social <info@clubsocialmontegrande.ar>';

    Accounts.emailTemplates.verifyEmail.html = (
      user: Meteor.User,
      url: string
    ) => {
      const urlWithoutHashtag = url.replace('#/', '');

      // @ts-ignore
      return `Hola ${user.profile?.firstName} ${user.profile?.lastName}, verifica tu cuenta: <a href="${urlWithoutHashtag}">${urlWithoutHashtag}</a>`;
    };

    Accounts.emailTemplates.enrollAccount.html = (
      user: Meteor.User,
      url: string
    ) => {
      const urlWithoutHashtag = url.replace('#/', '');

      // @ts-ignore
      return `Hola ${user.profile?.firstName} ${user.profile?.lastName}, activa tu cuenta: <a href="${urlWithoutHashtag}">${urlWithoutHashtag}</a>`;
    };
  }

  private _migrate() {
    this._migrations.start();
  }

  private _registerMethods() {
    this._usersMethods.register();
  }

  // #endregion Private Methods (4)
}

Meteor.startup(async () => {
  await container.resolve(ServerStartup).start();
});
