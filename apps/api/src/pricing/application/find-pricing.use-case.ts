import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { Inject, Injectable } from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { Result } from '@/shared/domain/result';

import { PricingService } from '../domain/services/pricing.service';

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
    private readonly pricingService: PricingService,
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

    // Delegate to domain service
    return this.pricingService.calculatePricing({
      dueCategory: params.dueCategory,
      memberCategory: params.memberCategory,
      memberId: params.memberId,
    });
  }
}
