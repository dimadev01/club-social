import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';

import type { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { Guard } from '@/shared/domain/guards';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { GetPaginatedDataRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedDataResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdReqResDto } from '@/shared/presentation/dto/param-id.dto';

import { CreatePricingUseCase } from '../application/create-pricing.use-case';
import { FindActivePricingUseCase } from '../application/find-active-pricing.use-case';
import { UpdatePricingUseCase } from '../application/update-pricing.use-case';
import { PricingEntity } from '../domain/entities/pricing.entity';
import {
  PRICING_REPOSITORY_PROVIDER,
  type PricingRepository,
} from '../domain/pricing.repository';
import { CreatePricingRequestDto } from './dto/create-pricing.dto';
import { FindActivePricingRequestDto } from './dto/find-active-pricing.dto';
import { PricingPaginatedDto } from './dto/pricing-paginated.dto';
import { PricingResponseDto } from './dto/pricing-response.dto';
import { UpdatePricingRequestDto } from './dto/update-pricing.dto';

@Controller('pricing')
export class PricingController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createPricingUseCase: CreatePricingUseCase,
    private readonly updatePricingUseCase: UpdatePricingUseCase,
    private readonly findActivePricingUseCase: FindActivePricingUseCase,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() body: CreatePricingRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdReqResDto> {
    const { id } = this.handleResult(
      await this.createPricingUseCase.execute({
        amount: body.amount,
        createdBy: session.user.name,
        dueCategory: body.dueCategory,
        effectiveFrom: body.effectiveFrom,
        memberCategory: body.memberCategory,
      }),
    );

    return { id: id.value };
  }

  @Patch(':id')
  public async update(
    @Param() request: ParamIdReqResDto,
    @Body() body: UpdatePricingRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.updatePricingUseCase.execute({
        amount: body.amount,
        effectiveFrom: body.effectiveFrom,
        id: request.id,
        updatedBy: session.user.name,
      }),
    );
  }

  @Get('active')
  public async getActive(
    @Query() query: FindActivePricingRequestDto,
  ): Promise<null | PricingResponseDto> {
    const pricing = this.handleResult(
      await this.findActivePricingUseCase.execute({
        dueCategory: query.dueCategory,
        memberCategory: query.memberCategory,
      }),
    );

    return pricing ? this.toDetailDto(pricing) : null;
  }

  @Get('paginated')
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
  ): Promise<PaginatedDataResponseDto<PricingPaginatedDto>> {
    const result = await this.pricingRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: result.data.map((item) => ({
        amount: item.pricing.amount.toCents(),
        createdAt: item.pricing.createdAt?.toISOString() ?? '',
        createdBy: item.pricing.createdBy ?? '',
        dueCategory: item.pricing.dueCategory,
        effectiveFrom: item.pricing.effectiveFrom.value,
        effectiveTo: item.pricing.effectiveTo?.value ?? null,
        id: item.pricing.id.value,
        memberCategory: item.pricing.memberCategory,
      })),
      total: result.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdReqResDto,
  ): Promise<PricingResponseDto> {
    const pricing = await this.pricingRepository.findById(
      UniqueId.raw({ value: request.id }),
    );

    if (!pricing) {
      throw new NotFoundException();
    }

    return this.toDetailDto(pricing);
  }

  private toDetailDto(pricing: PricingEntity): PricingResponseDto {
    Guard.date(pricing.createdAt);
    Guard.string(pricing.createdBy);
    Guard.date(pricing.updatedAt);

    return {
      amount: pricing.amount.toCents(),
      createdAt: pricing.createdAt.toISOString(),
      createdBy: pricing.createdBy,
      dueCategory: pricing.dueCategory,
      effectiveFrom: pricing.effectiveFrom.value,
      effectiveTo: pricing.effectiveTo?.value ?? null,
      id: pricing.id.value,
      memberCategory: pricing.memberCategory,
      updatedAt: pricing.updatedAt.toISOString(),
      updatedBy: pricing.updatedBy,
    };
  }
}
