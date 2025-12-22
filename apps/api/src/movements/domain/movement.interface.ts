import { MovementCategory, MovementType } from '@club-social/shared/movements';

import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface CreateMovementProps {
  amount: Amount;
  category: MovementCategory;
  createdBy: string;
  date: DateOnly;
  description: null | string;
  paymentId: null | UniqueId;
  type: MovementType;
}

export interface VoidMovementProps {
  voidedBy: string;
  voidReason: string;
}
