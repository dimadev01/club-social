import { Mongo } from 'meteor/mongo';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { GetUsersRequestDto } from '@domain/users/use-cases/get-users-grid/get-users-grid-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { UseCase } from '@infra/use-cases/use-case';

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

    if (request.filters?.['profile.role']?.length) {
      query['profile.role'] = {
        $in: request.filters['profile.role'] as string[],
      };
    }

    const options = this.createQueryOptions(request.page, request.pageSize);

    if (request.sortField) {
      if (request.sortField === 'profile') {
        options.sort['profile.firstName'] = this.getSorterValue(
          request.sortOrder
        );
      }
    }

    return ok({
      count: await Meteor.users.find(query).countAsync(),
      data: await Meteor.users.find(query, options).fetchAsync(),
    });
  }
}
