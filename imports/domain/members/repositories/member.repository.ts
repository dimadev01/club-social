import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { IGridRepository } from '@domain/common/repositories/grid.repository';
import { FindOneModelById } from '@domain/common/repositories/queryable.repository';
import { Member } from '@domain/members/models/member.model';
import {
  FindMembers,
  FindMembersToExport,
  FindPaginatedMembersRequest,
  FindPaginatedMembersResponse,
  GetBalanceResponse,
} from '@domain/members/repositories/member-repository.types';

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

export interface FindOneMemberById extends FindOneModelById {
  fetchUser?: boolean;
}
