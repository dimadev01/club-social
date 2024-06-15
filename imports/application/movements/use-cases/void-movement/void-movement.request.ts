import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUnitOfWork } from '@application/common/repositories/unit-of-work';

export interface VoidMovementRequest extends FindOneById {
  unitOfWork?: IUnitOfWork;
  voidReason: string;
  voidedBy: string;
}
