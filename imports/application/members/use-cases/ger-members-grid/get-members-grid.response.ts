import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { Member } from '@domain/members/models/member.model';
import {
  FindPaginatedMembersResponseTotals,
  GetBalanceResponse,
} from '@domain/members/repositories/member-repository.types';

export type GetMembersGridResponse<T = Member> = FindPaginatedResponse<T> & {
  balances: GetBalanceResponse[];
  totals: FindPaginatedMembersResponseTotals;
};
