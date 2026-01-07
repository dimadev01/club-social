import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { Inject, Injectable } from '@nestjs/common';

import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PricingEntity } from '../entities/pricing.entity';
import {
  PRICING_REPOSITORY_PROVIDER,
  type PricingRepository,
} from '../pricing.repository';

export const PRICING_OVERLAP_SERVICE_PROVIDER = Symbol(
  'PRICING_OVERLAP_SERVICE_PROVIDER',
);

export interface ResolveOverlapsParams {
  dueCategory: DueCategory;
  effectiveFrom: DateOnly;
  excludeId?: UniqueId;
  memberCategory: MemberCategory | null;
  updatedBy: string;
}

export interface ResolveOverlapsResult {
  toClose: PricingEntity[];
  toDelete: PricingEntity[];
}

@Injectable()
export class PricingOverlapService {
  public constructor(
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
  ) {}

  /**
   * Finds overlapping prices and prepares them for closure or deletion.
   *
   * Business rules:
   * 1. Prices that start before the new effectiveFrom: close them one day before
   * 2. Prices that start on or after the new effectiveFrom: mark for deletion (superseded)
   *
   * Note: This method modifies the entities in place (calls close() or delete()).
   * The caller is responsible for persisting and dispatching events.
   */
  public async resolveOverlaps(
    params: ResolveOverlapsParams,
  ): Promise<ResolveOverlapsResult> {
    const overlapping = await this.pricingRepository.findOverlapping({
      dueCategory: params.dueCategory,
      effectiveFrom: params.effectiveFrom,
      excludeId: params.excludeId,
      memberCategory: params.memberCategory,
    });

    const toClose: PricingEntity[] = [];
    const toDelete: PricingEntity[] = [];

    for (const existing of overlapping) {
      if (existing.effectiveFrom.isBefore(params.effectiveFrom)) {
        existing.close(params.effectiveFrom.subtractDays(1), params.updatedBy);
        toClose.push(existing);
      } else {
        existing.delete(params.updatedBy, new Date());
        toDelete.push(existing);
      }
    }

    return { toClose, toDelete };
  }
}
