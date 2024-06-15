import { FindOneById } from '@application/common/repositories/queryable.repository';

export interface VoidPaymentRequest extends FindOneById {
  voidReason: string;
  voidedBy: string;
}
