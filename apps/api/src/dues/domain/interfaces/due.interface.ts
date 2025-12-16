import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';

export interface UpdateDueProps {
  amount: Amount;
  notes: null | string;
  updatedBy: string;
}

export interface VoidDueProps {
  voidedBy: string;
  voidReason: string;
}
