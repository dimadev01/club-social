import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Member } from '@domain/members/entities/member.entity';
import { FindPaginatedMember } from '@infra/mongo/repositories/member-repository.types';

export interface IMemberPort
  extends ICrudPort<Member>,
    IPaginatedPort<FindPaginatedMember> {}
