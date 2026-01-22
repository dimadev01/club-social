import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { Inject, Injectable } from '@nestjs/common';

import {
  GROUP_REPOSITORY_PROVIDER,
  type GroupRepository,
} from '@/groups/domain/group.repository';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import { err, ok, Result } from '@/shared/domain/result';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PricingEntity } from '../entities/pricing.entity';
import {
  PRICING_REPOSITORY_PROVIDER,
  type PricingRepository,
} from '../pricing.repository';

export interface CalculatePricingParams {
  dueCategory: DueCategory;
  memberCategory: MemberCategory;
  memberId: string;
}

export interface CalculatePricingResult {
  amount: number;
  baseAmount: number;
  discountPercent: number;
  isGroupPricing: boolean;
}

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
export class PricingService {
  public constructor(
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
  ) {}

  /**
   * Calculates pricing for a member, including group discounts for MEMBERSHIP dues.
   *
   * Returns null if no pricing configuration exists.
   * For non-MEMBERSHIP dues, returns base pricing without group discounts.
   * For MEMBERSHIP dues, applies group discount if member belongs to a group.
   */
  public async calculatePricing(
    params: CalculatePricingParams,
  ): Promise<Result<CalculatePricingResult | null>> {
    const pricing = await this.pricingRepository.findActiveWithFallback(
      params.dueCategory,
      params.memberCategory,
    );

    if (!pricing) {
      return ok(null);
    }

    // For non-MEMBERSHIP dues, return base pricing without discounts
    if (params.dueCategory !== DueCategory.MEMBERSHIP) {
      return ok({
        amount: pricing.amount.cents,
        baseAmount: pricing.amount.cents,
        discountPercent: 0,
        isGroupPricing: false,
      });
    }

    // For MEMBERSHIP dues, check for group discounts
    const memberId = UniqueId.raw({ value: params.memberId });

    const group = await this.groupRepository.findByMemberId(memberId);

    if (!group || group.discount.isZero()) {
      return ok({
        amount: pricing.amount.cents,
        baseAmount: pricing.amount.cents,
        discountPercent: 0,
        isGroupPricing: false,
      });
    }

    // Apply group discount
    const baseAmount = pricing.amount;
    const applyDiscountResult = baseAmount.applyDiscount(group.discount.value);

    if (applyDiscountResult.isErr()) {
      return err(applyDiscountResult.error);
    }

    const amount = applyDiscountResult.value;

    return ok({
      amount: amount.cents,
      baseAmount: baseAmount.cents,
      discountPercent: group.discount.value,
      isGroupPricing: true,
    });
  }

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
