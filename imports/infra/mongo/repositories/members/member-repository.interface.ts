import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import { MemberModel } from '@domain/members/models/member.model';

export type IMemberRepository<TSession = unknown> = ICrudRepository<
  MemberModel,
  TSession
>;
