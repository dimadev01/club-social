import 'reflect-metadata';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { container, singleton } from 'tsyringe';
import { Permission, Role, Scope } from '@domain/roles/roles.enum';
import { Logger } from '@kernel/logger/logger.service';

@singleton()
export class ServerStartup {
  public constructor(private readonly _logger: Logger) {}

  public async start() {
    this._configureEmails();

    await this._createUserAdmin();

    await this._configureRoles();

    if (Meteor.isProduction) {
      this._logger.info('Server startup completed');
    }
  }

  private async _configureRoles() {
    if ((await Roles.getAllRoles().countAsync()) > 0) {
      return;
    }

    Roles.createRole(Role.Admin);

    Roles.createRole(Role.Member);

    Roles.createRole(Role.Staff);

    Roles.createRole(Permission.Write);

    Roles.createRole(Permission.Delete);

    Roles.createRole(Permission.Read);
  }

  private _configureEmails() {
    if (Meteor.isDevelopment) {
      process.env.MAIL_URL = Meteor.settings.MAIL_URL;
    }

    Accounts.config({ sendVerificationEmail: true });

    Accounts.emailTemplates.siteName = 'Club Social Monte Grande';

    Accounts.emailTemplates.from =
      'Club Social <info@clubsocialmontegrande.ar>';
  }

  private async _createUserAdmin() {
    // await Meteor.users.removeAsync({});

    if ((await Meteor.users.find().countAsync()) > 0) {
      return;
    }

    let userId: string | null = null;

    try {
      // @ts-ignore
      userId = await Accounts.createUserVerifyingEmail({
        email: 'info@clubsocialmontegrande.ar',
        password: '3214',
        profile: {
          firstName: 'Admin',
          lastName: 'Admin',
        },
      });

      if (userId) {
        Roles.addUsersToRoles(
          userId,
          [Permission.Delete, Permission.Read, Permission.Write],
          Scope.Users
        );
      }
    } catch (error) {
      if (userId) {
        await Meteor.users.removeAsync(userId);
      }
    }
  }
}

Meteor.startup(async () => {
  await container.resolve(ServerStartup).start();
});
