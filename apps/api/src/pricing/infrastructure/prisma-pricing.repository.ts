import type {
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { Injectable } from '@nestjs/common';

import {
  PricingOrderByWithRelationInput,
  PricingWhereInput,
} from '@/infrastructure/database/prisma/generated/models';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PricingEntity } from '../domain/entities/pricing.entity';
import { PricingRepository } from '../domain/pricing.repository';
import {
  FindOverlappingPricingParams,
  PricingPaginatedModel,
} from '../domain/pricing.types';
import { PrismaPricingMapper } from './prisma-pricing.mapper';

@Injectable()
export class PrismaPricingRepository implements PricingRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaPricingMapper,
  ) {}

  public async findByDueCategoryAndMemberCategory(
    dueCategory: DueCategory,
    memberCategory: MemberCategory,
  ): Promise<PricingEntity[]> {
    const prices = await this.prismaService.pricing.findMany({
      where: {
        deletedAt: null,
        dueCategory,
        memberCategory,
      },
    });

    return prices.map((pricing) => this.mapper.toDomain(pricing));
  }

  public async findOneActive(
    dueCategory: DueCategory,
    memberCategory: MemberCategory,
  ): Promise<null | PricingEntity> {
    const today = DateOnly.today();

    const pricing = await this.prismaService.pricing.findFirst({
      where: {
        deletedAt: null,
        dueCategory,
        effectiveFrom: { lte: today.value },
        memberCategory,
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: today.value } }],
      },
    });

    return pricing ? this.mapper.toDomain(pricing) : null;
  }

  public async findOverlapping(
    params: FindOverlappingPricingParams,
  ): Promise<PricingEntity[]> {
    // Find all pricings for the same category pair that would overlap with the new pricing
    // New pricing range: [effectiveFrom, infinity]
    // Existing pricing range: [effectiveFrom, effectiveTo or infinity]
    // Overlap exists if: existing.effectiveFrom < new.infinity AND new.effectiveFrom < existing.effectiveTo
    // Since new.effectiveTo is always null (infinity), this simplifies to:
    // - existing.effectiveFrom is any date (could be before or after new.effectiveFrom)
    // - AND (existing.effectiveTo is null OR existing.effectiveTo >= new.effectiveFrom)
    const where: PricingWhereInput = {
      deletedAt: null,
      dueCategory: params.dueCategory,
      memberCategory: params.memberCategory,
      OR: [
        { effectiveTo: null },
        { effectiveTo: { gte: params.effectiveFrom.value } },
      ],
    };

    if (params.excludeId) {
      where.id = { not: params.excludeId.value };
    }

    const prices = await this.prismaService.pricing.findMany({
      orderBy: { effectiveFrom: 'asc' },
      where,
    });

    return prices.map((pricing) => this.mapper.toDomain(pricing));
  }

  public async findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<PricingPaginatedModel, never>> {
    const where: PricingWhereInput = { deletedAt: null };
    const orderBy: PricingOrderByWithRelationInput[] = [
      { dueCategory: 'asc' },
      { memberCategory: 'asc' },
      { effectiveFrom: 'desc' },
    ];

    const [prices, total] = await Promise.all([
      this.prismaService.pricing.findMany({
        orderBy,
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        where,
      }),
      this.prismaService.pricing.count({ where }),
    ]);

    return {
      data: prices.map((pricing) => ({
        pricing: this.mapper.toDomain(pricing),
      })),
      total,
    };
  }

  public async findUniqueActive(
    dueCategory: DueCategory,
    memberCategory: MemberCategory,
  ): Promise<null | PricingEntity> {
    const pricing = await this.prismaService.pricing.findFirst({
      where: {
        deletedAt: null,
        dueCategory,
        effectiveTo: null,
        memberCategory,
      },
    });

    return pricing ? this.mapper.toDomain(pricing) : null;
  }

  public async findUniqueById(id: UniqueId): Promise<null | PricingEntity> {
    const pricing = await this.prismaService.pricing.findUnique({
      where: { deletedAt: null, id: id.value },
    });

    if (!pricing) {
      return null;
    }

    return this.mapper.toDomain(pricing);
  }

  public async findUniqueByIds(ids: UniqueId[]): Promise<PricingEntity[]> {
    const prices = await this.prismaService.pricing.findMany({
      where: {
        deletedAt: null,
        id: { in: ids.map((id) => id.value) },
      },
    });

    return prices.map((pricing) => this.mapper.toDomain(pricing));
  }

  public async findUniqueOrThrow(id: UniqueId): Promise<PricingEntity> {
    const pricing = await this.prismaService.pricing.findUniqueOrThrow({
      where: { deletedAt: null, id: id.value },
    });

    return this.mapper.toDomain(pricing);
  }

  public async save(entity: PricingEntity): Promise<PricingEntity> {
    const data = this.mapper.toPersistence(entity);

    await this.prismaService.pricing.upsert({
      create: data,
      update: data,
      where: { id: entity.id.value },
    });

    return entity;
  }
}
