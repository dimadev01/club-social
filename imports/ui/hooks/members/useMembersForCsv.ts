import { MemberGridDto } from '@domain/members/use-cases/get-members-grid/get-members-grid.dto';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { useQuery } from '@tanstack/react-query';

export const useMembersForCsv = (request: PaginatedRequestDto) =>
  useQuery<PaginatedRequestDto, Error, PaginatedResponse<MemberGridDto>>(
    [MethodsEnum.MembersGetForCsv, request],
    () => Meteor.callAsync(MethodsEnum.MembersGetForCsv, request)
  );
