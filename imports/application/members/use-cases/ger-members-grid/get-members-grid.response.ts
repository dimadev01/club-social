import { GetGridResponse } from '@application/common/requests/get-grid.response';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { FindPaginatedMembersResponseTotals } from '@domain/members/repositories/member-repository.types';

export type GetMembersGridResponse = GetGridResponse<MemberGridDto> & {
  totals: FindPaginatedMembersResponseTotals;
};
