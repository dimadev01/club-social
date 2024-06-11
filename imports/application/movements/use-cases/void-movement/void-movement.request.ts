import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';

export interface VoidMovementRequest extends FindOneById {
  unitOfWork?: IUnitOfWork;
  voidReason: string;
  voidedBy: string;
}
