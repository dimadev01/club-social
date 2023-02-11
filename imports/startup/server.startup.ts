import 'reflect-metadata';
import '@infra/publications/meteor-publications';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { container, singleton } from 'tsyringe';
import { MigrationsService } from '@infra/migrations/migrations.service';
import { Logger } from '@kernel/logger/logger.service';

@singleton()
export class ServerStartup {
  // #region Constructors (1)

  public constructor(
    private readonly _logger: Logger,
    private readonly _migrations: MigrationsService
  ) {}

  // #endregion Constructors (1)

  // #region Public Methods (1)

  public async start() {
    this._configureEmails();

    this._migrate();

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

    Accounts.config({ sendVerificationEmail: true });

    Accounts.emailTemplates.siteName = 'Club Social Monte Grande';

    Accounts.emailTemplates.from =
      'Club Social <info@clubsocialmontegrande.ar>';
  }

  private _migrate() {
    this._migrations.start();
  }

  // #endregion Private Methods (4)
}

Meteor.startup(async () => {
  await container.resolve(ServerStartup).start();
});
