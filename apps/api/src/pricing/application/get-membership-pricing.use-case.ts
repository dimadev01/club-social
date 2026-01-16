import {
  AppSettingKey,
  type GroupDiscountTier,
} from '@club-social/shared/app-settings';
import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { Inject, Injectable } from '@nestjs/common';

import { AppSettingService } from '@/app-settings/infrastructure/app-setting.service';
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

interface GetMembershipPricingParams {
  dueCategory: DueCategory;
  memberCategory: MemberCategory;
  memberId: string;
}

interface MembershipPricingResponse {
  amount: number;
  baseAmount: number;
  discountPercent: number;
  isGroupPricing: boolean;
}

@Injectable()
export class GetMembershipPricingUseCase extends UseCase<MembershipPricingResponse | null> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
    private readonly appSettingService: AppSettingService,
  ) {
    super(logger);
  }

  public async execute(
    params: GetMembershipPricingParams,
  ): Promise<Result<MembershipPricingResponse | null>> {
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

    const groupSize = await this.groupRepository.findGroupSizeByMemberId(
      member.id,
    );

    if (groupSize === 0) {
      return ok({
        amount: pricing.amount.cents,
        baseAmount: pricing.amount.cents,
        discountPercent: 0,
        isGroupPricing: false,
      });
    }

    const tiersSetting = await this.appSettingService.getValue(
      AppSettingKey.GROUP_DISCOUNT_TIERS,
    );

    const discountPercent = this.getDiscountPercent(
      tiersSetting.value,
      groupSize,
    );

    const baseAmount = pricing.amount;
    const applyDiscountResult = baseAmount.applyDiscount(discountPercent);

    if (applyDiscountResult.isErr()) {
      return err(applyDiscountResult.error);
    }

    const amount = applyDiscountResult.value;

    return ok({
      amount: amount.cents,
      baseAmount: baseAmount.cents,
      discountPercent,
      isGroupPricing: true,
    });
  }

  private getDiscountPercent(
    tiers: GroupDiscountTier[],
    groupSize: number,
  ): number {
    const tier = tiers.find(
      (current) => groupSize >= current.minSize && groupSize <= current.maxSize,
    );

    return tier?.percent ?? 0;
  }
}
