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
import { FindPaginatedMembersResponse } from '@domain/members/repositories/find-paginated-members-repository.interface';
import { MemberBalance } from '@domain/members/repositories/get-balances-repository.interface';

export interface IMemberRepository<TSession = unknown>
  extends ICrudRepository<MemberModel, TSession>,
    IQueryableGridRepository<MemberModel, GetMembersGridRequest> {
  find(request: FindMembersRequest): Promise<MemberModel[]>;
  findByDocument(documentID: string): Promise<MemberModel | null>;
  findPaginated(
    request: GetMembersGridRequest,
  ): Promise<FindPaginatedMembersResponse<MemberModel>>;
  findToExport(request: GetMembersGridRequest): Promise<MemberModel[]>;
  getBalances(memberIds: string[]): Promise<MemberBalance[]>;
}

export interface GetMembersGridRequest extends FindPaginatedRequest {
  filterByCategory: MemberCategoryEnum[] | null;
  filterByDebtStatus: string[] | null;
  filterById: string[] | null;
  filterByStatus: MemberStatusEnum[] | null;
}

export interface FindMembersRequest {
  category?: MemberCategoryEnum[];
  status?: MemberStatusEnum[];
}
