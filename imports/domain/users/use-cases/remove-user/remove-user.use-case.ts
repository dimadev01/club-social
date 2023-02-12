import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { StaffRole } from '@domain/roles/roles.enum';
import { RemoveUserRequestDto } from '@domain/users/use-cases/remove-user/remove-user-request.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class RemoveUserUseCase
  extends UseCase<RemoveUserRequestDto>
  implements IUseCase<RemoveUserRequestDto, undefined>
{
  public async execute(
    request: RemoveUserRequestDto
  ): Promise<Result<undefined, Error>> {
    await this.validateDto(RemoveUserRequestDto, request);

    if (request.id === Meteor.userId()) {
      return err(new Error('No puedes eliminarte a ti mismo'));
    }

    Object.entries(StaffRole).forEach(([key, value]) => {
      Roles.removeUsersFromRoles(request.id, value, key);
    });

    await Meteor.users.removeAsync(request.id);

    return ok(undefined);
  }
}
