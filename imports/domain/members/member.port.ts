import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Member } from '@domain/members/entities/member.entity';
import {
  FindPaginatedMember,
  FindPaginatedMembersRequest,
} from '@infra/mongo/repositories/members/member-repository.types';

export interface IMemberPort
  extends ICrudPort<Member>,
    IPaginatedPort<FindPaginatedMember> {
  findAll(): Promise<Member[]>;
  findOneByUserId(userId: string): Promise<Member | null>;
  findOneByUserIdOrThrow(userId: string): Promise<Member>;
  findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedResponse<FindPaginatedMember>>;
  getLoggedInOrThrow(): Promise<Member>;
}
