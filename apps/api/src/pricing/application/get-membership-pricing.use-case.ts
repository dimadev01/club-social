import type { MembershipPricingDto } from '@club-social/shared/pricing';

import {
  AppSettingKey,
  type GroupDiscountTier,
} from '@club-social/shared/app-settings';
import { DueCategory } from '@club-social/shared/dues';
import { Inject } from '@nestjs/common';

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
  memberId: string;
}

export class GetMembershipPricingUseCase extends UseCase<MembershipPricingDto | null> {
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
  ): Promise<Result<MembershipPricingDto | null>> {
    this.logger.info({
      message: 'Fetching membership pricing for member',
      params,
    });

    const memberId = UniqueId.raw({ value: params.memberId });
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      return err(new EntityNotFoundError('Member not found'));
    }

    const activePricing = await this.pricingRepository.findActiveWithFallback(
      DueCategory.MEMBERSHIP,
      member.category,
    );

    if (!activePricing) {
      return ok(null);
    }

    const groupSize = await this.groupRepository.findGroupSizeByMemberId(
      member.id,
    );
    const tiersSetting = await this.appSettingService.getValue(
      AppSettingKey.GROUP_DISCOUNT_TIERS,
    );
    const tiers = tiersSetting.value as GroupDiscountTier[];
    const discountPercent = this.getDiscountPercent(tiers, groupSize);
    const baseAmount = activePricing.amount.cents;
    const amount = this.applyDiscount(baseAmount, discountPercent);

    return ok({
      amount,
      baseAmount,
      discountPercent,
      groupSize,
    });
  }

  private applyDiscount(baseAmount: number, discountPercent: number): number {
    if (discountPercent <= 0) {
      return baseAmount;
    }

    return Math.round((baseAmount * (100 - discountPercent)) / 100);
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
