import { Member } from '@domain/members/models/member.model';
import { GetBalanceResponse } from '@domain/members/repositories/member-repository.types';

export interface GetMembersExportResponse<T = Member> {
  balances: GetBalanceResponse[];
  items: T[];
}
