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
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { EntityNotFoundError } from '@/shared/domain/errors/entity-not-found.error';
import { err, ok, Result } from '@/shared/domain/result';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  PRICING_REPOSITORY_PROVIDER,
  type PricingRepository,
} from '../domain/pricing.repository';

interface FindPricingParams {
  dueCategory: DueCategory;
  memberCategory: MemberCategory;
  memberId: string;
}

interface FindPricingResponse {
  amount: number;
  baseAmount: number;
  discountPercent: number;
  isGroupPricing: boolean;
}

@Injectable()
export class FindPricingUseCase extends UseCase<FindPricingResponse | null> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
  ) {
    super(logger);
  }

  public async execute(
    params: FindPricingParams,
  ): Promise<Result<FindPricingResponse | null>> {
    this.logger.info({
      message: 'Fetching membership pricing for member',
      params,
    });

    const pricing = await this.pricingRepository.findActiveWithFallback(
      params.dueCategory,
      params.memberCategory,
    );

    if (!pricing) {
      return ok(null);
    }

    if (params.dueCategory !== DueCategory.MEMBERSHIP) {
      return ok({
        amount: pricing.amount.cents,
        baseAmount: pricing.amount.cents,
        discountPercent: 0,
        isGroupPricing: false,
      });
    }

    const memberId = UniqueId.raw({ value: params.memberId });
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      return err(new EntityNotFoundError());
    }

    const group = await this.groupRepository.findByMemberId(
      UniqueId.raw({ value: params.memberId }),
    );

    if (!group) {
      return ok({
        amount: pricing.amount.cents,
        baseAmount: pricing.amount.cents,
        discountPercent: 0,
        isGroupPricing: false,
      });
    }

    if (group.discount.isZero()) {
      return ok({
        amount: pricing.amount.cents,
        baseAmount: pricing.amount.cents,
        discountPercent: 0,
        isGroupPricing: false,
      });
    }

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
}
