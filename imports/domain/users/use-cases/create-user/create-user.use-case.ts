import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Permission, Role, Scope } from '@domain/roles/roles.enum';
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
      email: request.email,
      profile: {
        firstName: request.firstName,
        lastName: request.lastName,
        role: request.role,
      },
    });

    if (request.role === Role.Staff) {
      Roles.addUsersToRoles(
        userId,
        [Permission.Read, Permission.Write],
        Scope.Members
      );
    }

    return ok(userId);
  }
}
