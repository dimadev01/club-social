import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { MemberCredit } from '@domain/members/models/member-credit.model';

export type IMemberCreditRepository = ICrudRepository<MemberCredit>;
