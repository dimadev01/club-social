import { Result, ok } from 'neverthrow';
import { injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { GetUserRequestDto } from '@domain/users/use-cases/get-user/get-user-request.dto';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class GetUserUseCase
  extends UseCaseOld<GetUserRequestDto>
  implements IUseCaseOld<GetUserRequestDto, Meteor.User | null>
{
  public async execute(
    request: GetUserRequestDto,
  ): Promise<Result<Meteor.User | null, Error>> {
    await this.validateDto(GetUserRequestDto, request);

    return ok((await Meteor.users.findOneAsync(request.id)) ?? null);
  }
}
