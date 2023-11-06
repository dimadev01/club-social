import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Member } from '@domain/members/entities/member.entity';
import {
  FindPaginatedMember,
  FindPaginatedMembersRequest,
} from '@infra/mongo/repositories/member-repository.types';

export interface IMemberPort
  extends ICrudPort<Member>,
    IPaginatedPort<FindPaginatedMember> {
  findAll(): Promise<Member[]>;
  findPaginated(
    request: FindPaginatedMembersRequest
  ): Promise<FindPaginatedResponse<FindPaginatedMember>>;
}
