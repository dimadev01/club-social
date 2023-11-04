import { ICrudPort } from '@application/repositories/crud.port';
import { IPaginatedRepository } from '@application/repositories/repository-paginated.interface';
import { Member } from '@domain/members/entities/member.entity';

export interface IMemberPort
  extends ICrudPort<Member>,
    IPaginatedRepository<Member> {}
