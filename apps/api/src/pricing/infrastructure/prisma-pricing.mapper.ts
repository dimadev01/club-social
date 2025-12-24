import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import { PricingModel } from '@/infrastructure/database/prisma/generated/models';
import { Mapper } from '@/infrastructure/repositories/mapper';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PricingEntity } from '../domain/entities/pricing.entity';

@Injectable()
export class PrismaPricingMapper extends Mapper<PricingEntity, PricingModel> {
  public toDomain(pricing: PricingModel): PricingEntity {
    return PricingEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: pricing.amount }),
        createdBy: pricing.createdBy,
        dueCategory: pricing.dueCategory as DueCategory,
        effectiveFrom: DateOnly.raw({ value: pricing.effectiveFrom }),
        effectiveTo: pricing.effectiveTo
          ? DateOnly.raw({ value: pricing.effectiveTo })
          : null,
        memberCategory: pricing.memberCategory as MemberCategory,
      },
      {
        createdAt: pricing.createdAt,
        createdBy: pricing.createdBy,
        deletedAt: pricing.deletedAt,
        deletedBy: pricing.deletedBy,
        id: UniqueId.raw({ value: pricing.id }),
        updatedAt: pricing.updatedAt,
        updatedBy: pricing.updatedBy,
      },
    );
  }

  public toPersistence(pricing: PricingEntity): PricingModel {
    return {
      amount: pricing.amount.toCents(),
      createdAt: pricing.createdAt,
      createdBy: pricing.createdBy,
      deletedAt: pricing.deletedAt,
      deletedBy: pricing.deletedBy,
      dueCategory: pricing.dueCategory,
      effectiveFrom: pricing.effectiveFrom.value,
      effectiveTo: pricing.effectiveTo?.value ?? null,
      id: pricing.id.value,
      memberCategory: pricing.memberCategory,
      updatedAt: pricing.updatedAt,
      updatedBy: pricing.updatedBy,
    };
  }
}
