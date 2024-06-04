import { GetBalanceResponse } from '@domain/members/member.repository';
import { Member } from '@domain/members/models/member.model';

export interface GetMembersExportResponse<T = Member> {
  balances: GetBalanceResponse[];
  items: T[];
}
