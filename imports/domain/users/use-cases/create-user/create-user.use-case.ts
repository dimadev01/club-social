import { toLower } from 'lodash';
import { ok, Result } from 'neverthrow';
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

    const userId = Accounts.createUser({
      email: toLower(request.email),
      profile: {
        firstName: request.firstName,
        lastName: request.lastName,
        role: request.role,
      },
    });

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
