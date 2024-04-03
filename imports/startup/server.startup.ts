import 'reflect-metadata';
import '@infra/di/di-registration';
import '@infra/meteor/common/meteor-publications';
import '@domain/users/user.collection';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { container, inject, singleton } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { DueMethod } from '@domain/dues/due.methods';
import { MovementMethod } from '@domain/movements/movement.methods';
import { PaymentMethod } from '@domain/payments/payment.methods';
import { ProfessorMethod } from '@domain/professors/professor.methods';
import { ServiceMethod } from '@domain/services/service.methods';
import { UserStateEnum } from '@domain/users/user.enum';
import { UserMethod } from '@domain/users/user.methods';
import { DIToken } from '@infra/di/di-tokens';
import { CategoryMethod } from '@infra/meteor/category.methods';
import { EmployeeMethod } from '@infra/meteor/employee.methods';
import { MemberMethod } from '@infra/meteor/member.methods';
import { MigrationService } from '@infra/migrations/migration.service';
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
    private readonly _dueMethod: DueMethod,
    private readonly _categoryMethod: CategoryMethod,
    private readonly _professorMethod: ProfessorMethod,
    private readonly _employeeMethod: EmployeeMethod,
    private readonly _serviceMethod: ServiceMethod,
    private readonly _paymentMethod: PaymentMethod
  ) {}

  public async start() {
    this._configureEmails();

    this._migrate();

    this._registerMethods();

    await this._createUsersIndexes();

    this._configureValidateLoginAttempt();

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

  private _configureValidateLoginAttempt() {
    Accounts.validateLoginAttempt(
      (attempt: { user: Meteor.User & { isActive: boolean } }) => {
        // @ts-ignore
        if (attempt.user?.state === UserStateEnum.INACTIVE) {
          return false;
        }

        return true;
      }
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

    this._memberMethod.register();

    this._movementMethod.register();

    this._categoryMethod.register();

    this._professorMethod.register();

    this._employeeMethod.register();

    this._serviceMethod.register();

    this._dueMethod.register();

    this._paymentMethod.register();
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
