import { FindOneById } from '@domain/common/repositories/queryable.repository';

export interface UpdateDueRequest extends FindOneById {
  amount: number;
  notes: string | null;
}
