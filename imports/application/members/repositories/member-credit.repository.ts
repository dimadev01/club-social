import { ICrudRepository } from '@application/common/repositories/crud.repository';
import { MemberCredit } from '@domain/members/models/member-credit.model';

export interface IMemberCreditRepository extends ICrudRepository<MemberCredit> {
  findByPayment(paymentId: string): Promise<MemberCredit[]>;
  getAvailable(memberId: string): Promise<GetAvailableResponse>;
}

export interface GetAvailableResponse {
  amount: number;
}
