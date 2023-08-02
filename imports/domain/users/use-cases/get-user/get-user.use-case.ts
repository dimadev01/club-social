import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';

@injectable()
export class GetUserUseCase
  extends UseCase<GetUserRequestDto>
  implements IUseCase<GetUserRequestDto, Meteor.User | null>
{
  public async execute(
    request: GetUserRequestDto
  ): Promise<Result<Meteor.User | null, Error>> {
    await this.validateDto(GetUserRequestDto, request);

    return ok((await Meteor.users.findOneAsync(request.id)) ?? null);
  }
}
