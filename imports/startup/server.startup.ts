import 'reflect-metadata';
import '@infra/di/di-registration';
import '@infra/meteor/common/meteor-publications';
import '@domain/users/users.collection';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { container, singleton } from 'tsyringe';
import { MembersMethods } from '@domain/members/members.methods';
import { MovementsMethods } from '@domain/movements/movements.methods';
import { ProfessorsMethods } from '@domain/professors/professors.methods';
import { ServicesMethods } from '@domain/services/services.methods';
import { UsersMethods } from '@domain/users/users.methods';
import { CategoriesMethods } from '@infra/meteor/categories.methods';
import { EmployeesMethods } from '@infra/meteor/employees.methods';
import { MigrationsService } from '@infra/migrations/migrations.service';

dayjs.extend(utc);

@singleton()
export class ServerStartup {
  // #region Constructors (1)

  public constructor(
    // @inject(Tokens.Logger)
    // private readonly _logger: ILogger,
    private readonly _migrations: MigrationsService,
    private readonly _usersMethods: UsersMethods,
    private readonly _membersMethods: MembersMethods,
    private readonly _movementsMethods: MovementsMethods,
    private readonly _categoriesMethods: CategoriesMethods,
    private readonly _professorsMethods: ProfessorsMethods,
    private readonly _employeesMethods: EmployeesMethods,
    private readonly _servicesMethods: ServicesMethods
  ) {}

  // #endregion Constructors (1)

  // #region Public Methods (1)

  public async start() {
    this._configureEmails();

    this._migrate();

    this._registerMethods();

    await this._createUsersIndexes();

    // if (Meteor.isProduction) {
    //   this._logger.info('Server startup completed');
    // }
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

      // @ts-expect-error
      return `Hola ${user.profile?.firstName} ${user.profile?.lastName}, verifica tu cuenta: <a href="${urlWithoutHashtag}">${urlWithoutHashtag}</a>`;
    };

    Accounts.emailTemplates.enrollAccount.html = (
      user: Meteor.User,
      url: string
    ) => {
      const urlWithoutHashtag = url.replace('#/', '');

      // @ts-expect-error
      return `Hola ${user.profile?.firstName} ${user.profile?.lastName}, activa tu cuenta: <a href="${urlWithoutHashtag}">${urlWithoutHashtag}</a>`;
    };
  }

  private async _createUsersIndexes() {
    await Meteor.users.createIndexAsync({ createdAt: -1 });

    await Meteor.users.createIndexAsync({ 'profile.firstName': 1 });

    await Meteor.users.createIndexAsync({ 'profile.lastName': 1 });

    await Meteor.users.createIndexAsync({ 'profile.role': 1 });
  }

  private _migrate() {
    this._migrations.start();
  }

  private async _registerMethods() {
    this._usersMethods.register();

    this._membersMethods.register();

    this._movementsMethods.register();

    this._categoriesMethods.register();

    this._professorsMethods.register();

    this._employeesMethods.register();

    this._servicesMethods.register();
  }

  // #endregion Private Methods (4)
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
