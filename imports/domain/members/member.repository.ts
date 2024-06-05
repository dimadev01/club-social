import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@domain/common/repositories/grid.repository';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { Member } from '@domain/members/models/member.model';

export interface IMemberRepository
  extends ICrudRepository<Member>,
    IGridRepository<
      Member,
      FindPaginatedMembersRequest,
      FindPaginatedMembersResponse
    > {
  find(request: FindMembers): Promise<Member[]>;
  findByDocument(documentID: string): Promise<Member | null>;
  findOneById(request: FindOneMemberById): Promise<Member | null>;
  findToExport(request: FindMembersToExport): Promise<Member[]>;
  getBalances(memberIds: string[]): Promise<GetBalanceResponse[]>;
}

export interface FindOneMemberById extends FindOneById {
  fetchUser?: boolean;
}

export interface FindMembers {
  category?: MemberCategoryEnum[];
  status?: MemberStatusEnum[];
}

export interface GetBalanceResponse {
  _id: string;
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

/**
 * FindPaginatedMembers
 */
export interface FindPaginatedMembersResponseTotals {
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export interface FindPaginatedMembersRequest extends FindPaginatedRequest {
  filterByCategory: MemberCategoryEnum[];
  filterByDebtStatus: string[];
  filterById: string[];
  filterByStatus: MemberStatusEnum[];
}

export interface FindPaginatedMembersResponse<T = Member>
  extends FindPaginatedResponse<T> {
  totals: FindPaginatedMembersResponseTotals;
}

/**
 * FindMembersToExport
 */
export type FindMembersToExport = FindPaginatedMembersRequest;
