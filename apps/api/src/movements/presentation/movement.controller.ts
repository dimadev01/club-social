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
import type { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';

import type { CreateMovementRequestDto } from './dto/create-movement.dto';
import type { VoidMovementRequestDto } from './dto/void-movement.dto';

import { CreateMovementUseCase } from '../application/create-movement/create-movement.use-case';
import { VoidMovementUseCase } from '../application/void-movement/void-movement.use-case';
import {
  MOVEMENT_REPOSITORY_PROVIDER,
  type MovementRepository,
} from '../domain/movement.repository';
import { MovementDetailDto } from './dto/movement-detail.dto';

@Controller('movements')
export class MovementsController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createMovementUseCase: CreateMovementUseCase,
    @Inject(MOVEMENT_REPOSITORY_PROVIDER)
    private readonly movementRepository: MovementRepository,
    private readonly voidMovementUseCase: VoidMovementUseCase,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() body: CreateMovementRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdDto> {
    const movement = this.handleResult(
      await this.createMovementUseCase.execute({
        amount: body.amount,
        category: body.category,
        createdBy: session.user.name,
        date: body.date,
        description: body.description,
        type: body.type,
      }),
    );

    return { id: movement.id.value };
  }

  @ApiPaginatedResponse(MovementDetailDto)
  @Get()
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<MovementDetailDto>> {
    const result = await this.movementRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: result.data.map((movement) => ({
        amount: movement.amount.toCents(),
        category: movement.category,
        createdAt: movement.createdAt.toISOString(),
        createdBy: movement.createdBy,
        date: movement.date.value,
        description: movement.description,
        id: movement.id.value,
        paymentId: movement.paymentId?.value ?? null,
        status: movement.status,
        type: movement.type,
        updatedAt: movement.updatedAt.toISOString(),
        updatedBy: movement.updatedBy,
        voidedAt: movement.voidedAt?.toISOString() ?? null,
        voidedBy: movement.voidedBy,
        voidReason: movement.voidReason,
      })),
      total: result.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() params: ParamIdDto,
  ): Promise<MovementDetailDto> {
    const movement = await this.movementRepository.findUniqueById(
      UniqueId.raw({ value: params.id }),
    );

    if (!movement) {
      throw new NotFoundException('Movimiento no encontrado');
    }

    return {
      amount: movement.amount.toCents(),
      category: movement.category,
      createdAt: movement.createdAt.toISOString(),
      createdBy: movement.createdBy,
      date: movement.date.value,
      description: movement.description,
      id: movement.id.value,
      paymentId: movement.paymentId?.value ?? null,
      status: movement.status,
      type: movement.type,
      updatedAt: movement.updatedAt.toISOString(),
      updatedBy: movement.updatedBy,
      voidedAt: movement.voidedAt?.toISOString() ?? null,
      voidedBy: movement.voidedBy,
      voidReason: movement.voidReason,
    };
  }

  @Patch(':id/void')
  public async void(
    @Param() params: ParamIdDto,
    @Body() body: VoidMovementRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.voidMovementUseCase.execute({
        id: params.id,
        voidedBy: session.user.name,
        voidReason: body.voidReason,
      }),
    );
  }
}
