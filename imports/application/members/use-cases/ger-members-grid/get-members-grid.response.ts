import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import {
  FindPaginatedMembersResponseTotals,
  GetBalanceResponse,
} from '@domain/members/member.repository';
import { Member } from '@domain/members/models/member.model';

export type GetMembersGridResponse<T = Member> = FindPaginatedResponse<T> & {
  balances: GetBalanceResponse[];
  totals: FindPaginatedMembersResponseTotals;
};
