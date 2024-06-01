import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { MemberModel } from '@domain/members/models/member.model';
import {
  FindMembersRequest,
  FindMembersToExportRequest,
  FindPaginatedMembersRequest,
  FindPaginatedMembersResponse,
  GetBalanceResponse,
} from '@domain/members/repositories/member-repository.types';

export interface IMemberRepository<TSession = unknown>
  extends ICrudRepository<MemberModel, TSession>,
    IGridRepository<
      MemberModel,
      FindPaginatedMembersRequest,
      FindPaginatedMembersResponse<MemberModel>
    > {
  find(request: FindMembersRequest): Promise<MemberModel[]>;
  findByDocument(documentID: string): Promise<MemberModel | null>;
  findToExport(request: FindMembersToExportRequest): Promise<MemberModel[]>;
  getBalances(memberIds: string[]): Promise<GetBalanceResponse[]>;
}
