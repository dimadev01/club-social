import { PaginatedResponse } from '@kernel/paginated-response.dto';

export class GetUsersResponseDto extends PaginatedResponse<Meteor.User> {}
