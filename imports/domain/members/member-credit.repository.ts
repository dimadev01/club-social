import { ICrudRepository } from '@domain/common/repositories/crud.repository';
import { MemberCredit } from '@domain/members/models/member-credit.model';

export interface IMemberCreditRepository extends ICrudRepository<MemberCredit> {
  findOneByPayment(paymentId: string): Promise<MemberCredit | null>;
}
