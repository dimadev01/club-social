import { toLower } from 'lodash';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Role, StaffRole } from '@domain/roles/roles.enum';
import { CreateUserRequestDto } from '@domain/users/use-cases/create-user/create-user-request.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class CreateUserUseCase
  extends UseCase
  implements IUseCase<CreateUserRequestDto, string>
{
  public async execute(
    request: CreateUserRequestDto
  ): Promise<Result<string, Error>> {
    await this.validateDto(CreateUserRequestDto, request);

    // @ts-ignore
    const userId = await Accounts.createUserVerifyingEmail({
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
    }

    return ok(userId);
  }
}
