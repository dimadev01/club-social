import { ICrudRepository } from '@application/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@application/common/repositories/grid.repository';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { Member } from '@domain/members/models/member.model';

export interface IMemberRepository
  extends ICrudRepository<Member>,
    IGridRepository<
      PaginatedMember,
      FindPaginatedMembersRequest,
      FindPaginatedMembersResponse
    > {
  find(request: FindMembers): Promise<Member[]>;
  findByDocument(documentID: string): Promise<Member | null>;
  findOneById(request: FindOneById): Promise<Member | null>;
  findToExport(request: FindMembersToExport): Promise<PaginatedMember[]>;
}

export interface FindMembers {
  category?: MemberCategoryEnum[];
  status?: MemberStatusEnum[];
}

/**
 * FindPaginatedMembers
 */

export interface FindPaginatedMembersRequest extends FindPaginatedRequest {
  filterByCategory: MemberCategoryEnum[];
  filterByDebtStatus: string[];
  filterById: string[];
  filterByStatus: MemberStatusEnum[];
}

export interface PaginatedMember {
  member: Member;
  pendingElectricity: number;
  pendingGuest: number;
  pendingMembership: number;
  pendingTotal: number;
}

export type FindPaginatedMembersResponse =
  FindPaginatedResponse<PaginatedMember>;

export type FindMembersToExport = FindPaginatedMembersRequest;
