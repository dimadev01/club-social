import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MemberRole, Role, StaffRole } from '@domain/roles/roles.enum';
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

    if (request.emails.some((email) => Accounts.findUserByEmail(email))) {
      return err(
        new Error('Al menos un email ya está en uso por otro usuario')
      );
    }

    const userId = Accounts.createUser({
      email: request.emails[0],
      profile: {
        firstName: request.firstName,
        lastName: request.lastName,
        role: request.role,
      },
    });

    if (request.emails.length > 1) {
      request.emails.slice(1).forEach((email) => {
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
