import { useQuery } from '@tanstack/react-query';

import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export const useMembersForCsv = (request: PaginatedRequestDto) =>
  useQuery<PaginatedRequestDto, Error, PaginatedResponse<MemberGridDto>>(
    [MeteorMethodEnum.MembersGetForCsv, request],
    () => Meteor.callAsync(MeteorMethodEnum.MembersGetForCsv, request),
  );
