import { isEqual } from 'lodash';
import { Mongo } from 'meteor/mongo';
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

    const query: Mongo.Query<Meteor.User> = {};

    if (request.search) {
      query.$or = [
        {
          'profile.firstName': {
            $options: 'i',
            $regex: request.search,
          },
        },
        {
          'profile.lastName': {
            $options: 'i',
            $regex: request.search,
          },
        },
        {
          'emails.address': {
            $options: 'i',
            $regex: request.search,
          },
        },
      ];
    }

    const options = this.createQueryOptions(request.page, request.pageSize);

    if (request.sortField) {
      if (request.sortField === 'profile') {
        options.sort['profile.firstName'] = this.getSorterValue(
          request.sortOrder
        );
      } else if (isEqual(request.sortField, ['profile', 'role'])) {
        options.sort['profile.role'] = this.getSorterValue(request.sortOrder);
      }
    }

    return ok({
      data: await Meteor.users.find(query, options).fetchAsync(),
      total: await Meteor.users.find(query).countAsync(),
    });
  }
}
