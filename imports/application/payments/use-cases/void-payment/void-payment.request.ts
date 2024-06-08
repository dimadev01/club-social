import { FindOneById } from '@domain/common/repositories/queryable.repository';

export interface VoidPaymentRequest extends FindOneById {
  voidReason: string;
  voidedBy: string;
}
