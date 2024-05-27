import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { MemberOld } from '@domain/members/models/member.old';
import {
  FindPaginatedMember,
  FindPaginatedMembersRequest,
} from '@infra/mongo/repositories/members/member-repository.types';

export interface IMemberPort
  extends ICrudPort<MemberOld>,
    IPaginatedPort<FindPaginatedMember> {
  findAll(): Promise<MemberOld[]>;
  findOneByUserId(userId: string): Promise<MemberOld | null>;
  findOneByUserIdOrThrow(userId: string): Promise<MemberOld>;
  findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedResponse<FindPaginatedMember>>;
  getLoggedInOrThrow(): Promise<MemberOld>;
}
