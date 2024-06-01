import { Result, ok } from 'neverthrow';
import { injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases-old/use-case.interface';
import { GetUserByTokenRequestDto } from '@application/users/dtos/get-user-by-token-request.dto';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class GetUserByTokenUseCase
  extends UseCaseOld<GetUserByTokenRequestDto>
  implements IUseCaseOld<GetUserByTokenRequestDto, Meteor.User | null>
{
  public async execute(
    request: GetUserByTokenRequestDto,
  ): Promise<Result<Meteor.User | null, Error>> {
    await this.validateDto(GetUserByTokenRequestDto, request);

    return ok(
      (await Meteor.users.findOneAsync({
        'services.password.enroll.token': request.token,
      })) ?? null,
    );
  }
}
