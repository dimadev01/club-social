import { FindOneById } from '@domain/common/repositories/queryable.repository';

export interface VoidMovementRequest extends FindOneById {
  voidReason: string;
  voidedBy: string;
}
