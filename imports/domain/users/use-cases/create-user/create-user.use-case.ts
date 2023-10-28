import { Random } from 'meteor/random';
import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import {
  AdminRole,
  MemberRole,
  Permission,
  Role,
  Scope,
  StaffRole,
} from '@domain/roles/roles.enum';
import { AtLeastOneEmailInUseError } from '@domain/users/errors/at-least-one-email-in-use.error';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class CreateUserUseCase
  extends UseCase<CreateUserRequestDto>
  implements IUseCase<CreateUserRequestDto, string>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger
  ) {
    super();
  }

  public async execute(
    request: CreateUserRequestDto
  ): Promise<Result<string, Error>> {
    this.validatePermission(Scope.Users, Permission.Create);

    await this.validateDto(CreateUserRequestDto, request);

    if (request.emails?.some((email) => Accounts.findUserByEmail(email))) {
      return err(new AtLeastOneEmailInUseError());
    }

    const userId = Accounts.createUser({
      profile: {
        firstName: request.firstName,
        lastName: request.lastName,
        role: request.role,
      },
      username: Random.secret(),
    });

    if (request.emails && request.emails.length > 0) {
      request.emails.forEach((email) => {
        Accounts.addEmail(userId, email);
      });
    }

    if (request.role === Role.Admin) {
      Object.entries(AdminRole).forEach(([key, value]) => {
        Roles.addUsersToRoles(userId, value, key);
      });
    } else if (request.role === Role.Staff) {
      Object.entries(StaffRole).forEach(([key, value]) => {
        Roles.addUsersToRoles(userId, value, key);
      });
    } else if (request.role === Role.Member) {
      Object.entries(MemberRole).forEach(([key, value]) => {
        Roles.addUsersToRoles(userId, value, key);
      });
    }

    this._logger.info('User created', { userId });

    return ok(userId);
  }
}
