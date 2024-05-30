import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import {
  FindPaginatedRequest,
  IQueryableGridRepository,
} from '@domain/common/repositories/queryable-grid-repository.interface';
import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';
import { MemberModel } from '@domain/members/models/member.model';

export interface GetMembersGridRequest extends FindPaginatedRequest {
  categoryFilter: MemberCategoryEnum[] | null;
  debtStatusFilter: string[] | null;
  idFilter: string[] | null;
  statusFilter: MemberStatusEnum[] | null;
}

export interface MemberBalance {
  _id: string;
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export interface FindMembersRequest {
  category: MemberCategoryEnum[] | null;
  status: MemberStatusEnum[] | null;
}

export interface IMemberRepository<TSession = unknown>
  extends ICrudRepository<MemberModel, TSession>,
    IQueryableGridRepository<MemberModel, GetMembersGridRequest> {
  find(request: FindMembersRequest): Promise<MemberModel[]>;
  findByDocument(documentID: string): Promise<MemberModel | null>;
  getBalances(memberIds: string[]): Promise<MemberBalance[]>;
}
