import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import {
  FindPaginatedRequest,
  IQueryableGridRepository,
} from '@domain/common/repositories/queryable-grid-repository.interface';
import { MemberCategoryEnum } from '@domain/members/member.enum';
import { MemberModel } from '@domain/members/models/member.model';

export interface FindPaginatedMembersRequest extends FindPaginatedRequest {
  filters: {
    category?: MemberCategoryEnum[];
  };
}

export interface IMemberRepository<TSession = unknown>
  extends ICrudRepository<MemberModel, TSession>,
    IQueryableGridRepository<MemberModel, FindPaginatedMembersRequest> {
  findByDocument(documentID: string): Promise<MemberModel | null>;
}
