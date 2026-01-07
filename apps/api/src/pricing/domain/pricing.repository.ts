import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';

import { PricingEntity } from './entities/pricing.entity';
import {
  FindOverlappingPricingParams,
  PricingPaginatedModel,
} from './pricing.types';

export const PRICING_REPOSITORY_PROVIDER = Symbol('PricingRepository');

export interface PricingRepository
  extends
    PaginatedRepository<PricingPaginatedModel, never>,
    ReadableRepository<PricingEntity>,
    WriteableRepository<PricingEntity> {
  findActiveWithFallback(
    dueCategory: DueCategory,
    memberCategory: MemberCategory,
  ): Promise<null | PricingEntity>;
  findByDueCategoryAndMemberCategory(
    dueCategory: DueCategory,
    memberCategory: MemberCategory | null,
  ): Promise<PricingEntity[]>;
  findOneActive(
    dueCategory: DueCategory,
    memberCategory: MemberCategory | null,
  ): Promise<null | PricingEntity>;
  findOverlapping(
    params: FindOverlappingPricingParams,
  ): Promise<PricingEntity[]>;
}
