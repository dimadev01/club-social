import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { GetUserByTokenRequestDto } from '@domain/users/use-cases/get-user-by-token/get-user-by-token-request.dto';

@injectable()
export class GetUserByTokenUseCase
  extends UseCase<GetUserByTokenRequestDto>
  implements IUseCase<GetUserByTokenRequestDto, Meteor.User | null>
{
  public async execute(
    request: GetUserByTokenRequestDto
  ): Promise<Result<Meteor.User | null, Error>> {
    await this.validateDto(GetUserByTokenRequestDto, request);

    return ok(
      (await Meteor.users.findOneAsync({
        'services.password.enroll.token': request.token,
      })) ?? null
    );
  }
}
