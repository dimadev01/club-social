import { FindOneById } from '@application/common/repositories/queryable.repository';

export interface UpdateDueRequest extends FindOneById {
  amount: number;
  notes: string | null;
}
