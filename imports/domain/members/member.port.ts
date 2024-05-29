import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { MemberOld } from '@domain/members/models/member.old';
import {
  FindPaginatedMemberOld,
  FindPaginatedMembersRequest,
} from '@infra/mongo/repositories/members/member-mongo-repository.types';

export interface IMemberPort
  extends ICrudPort<MemberOld>,
    IPaginatedPort<FindPaginatedMemberOld> {
  findAll(): Promise<MemberOld[]>;
  findOneByUserId(userId: string): Promise<MemberOld | null>;
  findOneByUserIdOrThrow(userId: string): Promise<MemberOld>;
  findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedResponse<FindPaginatedMemberOld>>;
  getLoggedInOrThrow(): Promise<MemberOld>;
}
