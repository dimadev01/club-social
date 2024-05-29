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

export interface FindPaginatedMembersRequest extends FindPaginatedRequest {
  filters: {
    _id?: string[];
    category?: MemberCategoryEnum[];
    status?: MemberStatusEnum[];
  };
}

export interface MemberBalance {
  _id: string;
  electricity: number;
  guest: number;
  membership: number;
  total: number;
}

export interface FindRequest {
  status: MemberStatusEnum[] | null;
}

export interface IMemberRepository<TSession = unknown>
  extends ICrudRepository<MemberModel, TSession>,
    IQueryableGridRepository<MemberModel, FindPaginatedMembersRequest> {
  find(request: FindRequest): Promise<MemberModel[]>;
  findByDocument(documentID: string): Promise<MemberModel | null>;
  getBalances(memberIds: string[]): Promise<MemberBalance[]>;
}
