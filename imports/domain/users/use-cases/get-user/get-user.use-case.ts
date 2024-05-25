import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetUserUseCase
  extends UseCase<GetUserRequestDto>
  implements IUseCase<GetUserRequestDto, Meteor.User | null>
{
  public async execute(
    request: GetUserRequestDto,
  ): Promise<Result<Meteor.User | null, Error>> {
    await this.validateDto(GetUserRequestDto, request);

    return ok((await Meteor.users.findOneAsync(request.id)) ?? null);
  }
}
