import { ICrudRepository } from '@domain/common/repositories/crud-repository.interface';
import { MemberModel } from '@domain/members/models/member.model';

export interface IMemberRepository<TSession = unknown>
  extends ICrudRepository<MemberModel, TSession> {
  findByDocument(documentID: string): Promise<MemberModel | null>;
}
