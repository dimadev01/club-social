import 'reflect-metadata';
import '@infra/di/di-registration';
import '@infra/meteor/common/meteor-publications';
import '@domain/users/users.collection';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { container, inject, singleton } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { MemberMethod } from '@domain/members/member.methods';
import { MovementMethod } from '@domain/movements/movements.methods';
import { ProfessorMethod } from '@domain/professors/professors.methods';
import { ServiceMethod } from '@domain/services/services.methods';
import { UserMethod } from '@domain/users/users.methods';
import { DIToken } from '@infra/di/di-tokens';
import { CategoryMethod } from '@infra/meteor/categories.methods';
import { EmployeeMethod } from '@infra/meteor/employees.methods';
import { MigrationService } from '@infra/migrations/migrations.service';
import { DateUtils } from '@shared/utils/date.utils';
import { AppConstants } from '@ui/app.enum';

DateUtils.extend();

@singleton()
export class ServerStartup {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    private readonly _migrationService: MigrationService,
    private readonly _userMethod: UserMethod,
    private readonly _memberMethod: MemberMethod,
    private readonly _movementMethod: MovementMethod,
    private readonly _categoryMethod: CategoryMethod,
    private readonly _professorMethod: ProfessorMethod,
    private readonly _employeeMethod: EmployeeMethod,
    private readonly _serviceMethod: ServiceMethod
  ) {}

  public async start() {
    this._configureEmails();

    this._migrate();

    this._registerMethods();

    await this._createUsersIndexes();

    if (Meteor.isProduction) {
      this._logger.info('Server startup completed');
    }
  }

  private _configureEmails() {
    if (Meteor.isDevelopment) {
      process.env.MAIL_URL = Meteor.settings.MAIL_URL;
    }

    Accounts.emailTemplates.siteName = 'Club Social Monte Grande';

    Accounts.emailTemplates.from = AppConstants.EmailFrom;

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
    this._migrationService.start();
  }

  private async _registerMethods() {
    this._userMethod.register();

    this._memberMethod.register();

    this._movementMethod.register();

    this._categoryMethod.register();

    this._professorMethod.register();

    this._employeeMethod.register();

    this._serviceMethod.register();
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
