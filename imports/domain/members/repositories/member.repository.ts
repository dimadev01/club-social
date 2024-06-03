import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { Member } from '@domain/members/models/member.model';
import {
  FindMembersRequest,
  FindMembersToExportRequest,
  FindPaginatedMembersRequest,
  FindPaginatedMembersResponse,
  GetBalanceResponse,
} from '@domain/members/repositories/member-repository.types';

export interface IMemberRepository<TSession = unknown>
  extends ICrudRepository<Member, TSession>,
    IGridRepository<
      Member,
      FindPaginatedMembersRequest,
      FindPaginatedMembersResponse
    > {
  find(request: FindMembersRequest): Promise<Member[]>;
  findByDocument(documentID: string): Promise<Member | null>;
  findToExport(request: FindMembersToExportRequest): Promise<Member[]>;
  getBalances(memberIds: string[]): Promise<GetBalanceResponse[]>;
}
