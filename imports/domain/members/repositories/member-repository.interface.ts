import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import { IQueryableGridRepository } from '@domain/common/repositories/queryable-grid-repository.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { FindMembersRequest } from '@domain/members/repositories/find-members.interface';
import {
  FindPaginatedMembersRequest,
  FindPaginatedMembersResponse,
} from '@domain/members/repositories/find-paginated-members.interface';
import { MemberBalance } from '@domain/members/repositories/get-balances.interface';

export interface IMemberRepository<TSession = unknown>
  extends ICrudRepository<MemberModel, TSession>,
    IQueryableGridRepository<
      MemberModel,
      FindPaginatedMembersRequest,
      FindPaginatedMembersResponse<MemberModel>
    > {
  find(request: FindMembersRequest): Promise<MemberModel[]>;
  findByDocument(documentID: string): Promise<MemberModel | null>;
  findToExport(request: FindPaginatedMembersRequest): Promise<MemberModel[]>;
  getBalances(memberIds: string[]): Promise<MemberBalance[]>;
}
