import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class GetUsersResponseDto extends PaginatedResponse<Meteor.User> {}
