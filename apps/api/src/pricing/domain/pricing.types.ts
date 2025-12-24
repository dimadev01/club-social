import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PricingEntity } from './entities/pricing.entity';

export interface FindOverlappingPricingParams {
  dueCategory: DueCategory;
  effectiveFrom: DateOnly;
  excludeId?: UniqueId;
  memberCategory: MemberCategory;
}

export interface PricingPaginatedModel {
  pricing: PricingEntity;
}
