import { FindOneById } from '@domain/common/repositories/queryable.repository';

export interface VoidDueRequest extends FindOneById {
  voidReason: string;
  voidedBy: string;
}
