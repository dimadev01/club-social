import { PaginatedResponse } from '@application/common/paginated-response.dto';

export class GetUsersResponseDto extends PaginatedResponse<Meteor.User> {}
