import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { GetUsersRequestDto } from '@domain/users/use-cases/get-users/get-users-request.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetUsersUseCase
  extends UseCase<GetUsersRequestDto>
  implements IUseCase<GetUsersRequestDto, PaginatedResponse<Meteor.User>>
{
  public async execute(
    request: GetUsersRequestDto
  ): Promise<Result<PaginatedResponse<Meteor.User>, Error>> {
    await this.validateDto(GetUsersRequestDto, request);

    console.log(request);

    return ok({
      data: await Meteor.users.find().fetchAsync(),
      total: await Meteor.users.find().countAsync(),
    });
  }
}
