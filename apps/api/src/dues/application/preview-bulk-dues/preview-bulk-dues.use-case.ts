import { DueCategory } from '@club-social/shared/dues';
import { MemberStatus } from '@club-social/shared/members';
import { Inject, Injectable } from '@nestjs/common';
import { sumBy } from 'es-toolkit/compat';
import pLimit from 'p-limit';

import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '@/members/domain/member.repository';
import { PricingService } from '@/pricing/domain/services/pricing.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ApplicationError } from '@/shared/domain/errors/application.error';
import { ok, Result } from '@/shared/domain/result';

import {
  PreviewBulkDuesMemberResponse,
  PreviewBulkDuesParams,
  PreviewBulkDuesResponse,
} from './preview-bulk-dues.params';

@Injectable()
export class PreviewBulkDuesUseCase extends UseCase<
  PreviewBulkDuesResponse,
  ApplicationError
> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
    private readonly pricingService: PricingService,
  ) {
    super(logger);
  }

  public async execute(
    params: PreviewBulkDuesParams,
  ): Promise<Result<PreviewBulkDuesResponse, ApplicationError>> {
    this.logger.info({
      message: 'Previewing bulk dues for member category',
      params,
    });

    const allMembers = await this.memberRepository.findByCategoryReadModel({
      category: params.memberCategory,
      status: MemberStatus.ACTIVE,
    });

    const limit = pLimit(25);

    const pricingResults = await Promise.all(
      allMembers.map((member) =>
        limit(async () => {
          const pricingResult = await this.pricingService.calculatePricing({
            dueCategory: DueCategory.MEMBERSHIP,
            memberCategory: params.memberCategory,
            memberId: member.id,
          });

          return { member, pricingResult };
        }),
      ),
    );

    const members: PreviewBulkDuesMemberResponse[] = [];

    for (const { member, pricingResult } of pricingResults) {
      if (pricingResult.isErr()) {
        this.logger.warn({
          memberId: member.id,
          message: 'Failed to find pricing for member, skipping',
        });
        continue;
      }

      const pricing = pricingResult.value;

      if (!pricing) {
        this.logger.warn({
          memberId: member.id,
          message: 'No pricing found for member, skipping',
        });
        continue;
      }

      members.push({
        amount: pricing.amount,
        baseAmount: pricing.baseAmount,
        discountPercent: pricing.discountPercent,
        isGroupPricing: pricing.isGroupPricing,
        memberCategory: member.category,
        memberId: member.id,
        memberName: member.name,
      });
    }

    const totalMembers = members.length;
    const totalAmount = sumBy(members, 'amount');

    return ok({
      members,
      summary: {
        totalAmount,
        totalMembers,
      },
    });
  }
}
