import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';

export interface UpdatePricingProps {
  amount: Amount;
  effectiveFrom: DateOnly;
  updatedBy: string;
}
