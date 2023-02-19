import { Random } from 'meteor/random';
import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MemberRole, Role, StaffRole } from '@domain/roles/roles.enum';
import { AtLeastOneEmailInUseError } from '@domain/users/errors/at-least-one-email-in-use.error';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class CreateUserUseCase
  extends UseCase<CreateUserRequestDto>
  implements IUseCase<CreateUserRequestDto, string>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: CreateUserRequestDto
  ): Promise<Result<string, Error>> {
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

    if (request.role === Role.Staff) {
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
