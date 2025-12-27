import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import {
  PricingCreateInput,
  PricingModel,
  PricingUpdateInput,
} from '@/infrastructure/database/prisma/generated/models';
import { Guard } from '@/shared/domain/guards';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PricingEntity } from '../domain/entities/pricing.entity';

@Injectable()
export class PrismaPricingMapper {
  public toCreateInput(entity: PricingEntity): PricingCreateInput {
    Guard.string(entity.createdBy);

    return {
      amount: entity.amount.toCents(),
      createdBy: entity.createdBy,
      dueCategory: entity.dueCategory,
      effectiveFrom: entity.effectiveFrom.value,
      effectiveTo: entity.effectiveTo?.value ?? null,
      id: entity.id.value,
      memberCategory: entity.memberCategory,
    };
  }

  public toDomain(pricing: PricingModel): PricingEntity {
    return PricingEntity.fromPersistence(
      {
        amount: Amount.raw({ cents: pricing.amount }),
        dueCategory: pricing.dueCategory as DueCategory,
        effectiveFrom: DateOnly.raw({ value: pricing.effectiveFrom }),
        effectiveTo: pricing.effectiveTo
          ? DateOnly.raw({ value: pricing.effectiveTo })
          : null,
        memberCategory: pricing.memberCategory as MemberCategory,
      },
      {
        audit: {
          createdAt: pricing.createdAt,
          createdBy: pricing.createdBy,
          updatedAt: pricing.updatedAt,
          updatedBy: pricing.updatedBy,
        },
        deleted: {
          deletedAt: pricing.deletedAt,
          deletedBy: pricing.deletedBy,
        },
        id: UniqueId.raw({ value: pricing.id }),
      },
    );
  }

  public toUpdateInput(entity: PricingEntity): PricingUpdateInput {
    return {
      amount: entity.amount.toCents(),
      deletedAt: entity.deletedAt,
      deletedBy: entity.deletedBy,
      dueCategory: entity.dueCategory,
      effectiveFrom: entity.effectiveFrom.value,
      effectiveTo: entity.effectiveTo?.value ?? null,
      id: entity.id.value,
      memberCategory: entity.memberCategory,
      updatedBy: entity.updatedBy,
    };
  }
}
