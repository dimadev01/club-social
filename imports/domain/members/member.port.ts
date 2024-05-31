import { FindPaginatedResponseOld } from '@application/pagination/find-paginated.response';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Member } from '@domain/members/models/member.old';
import {
  FindPaginatedMemberOld,
  FindPaginatedMembersRequest,
} from '@infra/mongo/repositories/members/member-mongo-repository.types';

export interface IMemberPort
  extends ICrudPort<Member>,
    IPaginatedPort<FindPaginatedMemberOld> {
  findAll(): Promise<Member[]>;
  findOneByUserId(userId: string): Promise<Member | null>;
  findOneByUserIdOrThrow(userId: string): Promise<Member>;
  findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedResponseOld<FindPaginatedMemberOld>>;
  getLoggedInOrThrow(): Promise<Member>;
}
