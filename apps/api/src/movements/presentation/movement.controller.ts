import type { Response } from 'express';

import { NumberFormat } from '@club-social/shared/lib';
import { MovementType } from '@club-social/shared/movements';
import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common';

import type { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';

import { CsvService } from '@/infrastructure/csv/csv.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { ExportDataRequestDto } from '@/shared/presentation/dto/export-request.dto';
import { GetPaginatedDataRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedDataResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdRequestDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateMovementUseCase } from '../application/create-movement/create-movement.use-case';
import { VoidMovementUseCase } from '../application/void-movement/void-movement.use-case';
import {
  MOVEMENT_REPOSITORY_PROVIDER,
  type MovementRepository,
} from '../domain/movement.repository';
import { CreateMovementRequestDto } from './dto/create-movement.dto';
import { MovementResponseDto } from './dto/movement-detail.dto';
import {
  MovementPaginatedExtraResponseDto,
  MovementPaginatedResponseDto,
} from './dto/movement-paginated.dto';
import {
  MovementStatisticsQueryRequestDto,
  MovementStatisticsResponseDto,
} from './dto/movement-statistics.dto';
import { VoidMovementRequestDto } from './dto/void-movement.dto';

@Controller('movements')
export class MovementsController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createMovementUseCase: CreateMovementUseCase,
    @Inject(MOVEMENT_REPOSITORY_PROVIDER)
    private readonly movementRepository: MovementRepository,
    private readonly voidMovementUseCase: VoidMovementUseCase,
    private readonly csvService: CsvService,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() body: CreateMovementRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdRequestDto> {
    const { id } = this.handleResult(
      await this.createMovementUseCase.execute({
        amount: body.amount,
        category: body.category,
        createdBy: session.user.name,
        date: body.date,
        notes: body.notes || null,
        type: body.type,
      }),
    );

    return { id: id.value };
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  public async export(
    @Query() query: ExportDataRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.movementRepository.findForExport({
      filters: query.filters,
      sort: query.sort,
    });

    const stream = this.csvService.generateStream(data, [
      { accessor: (row) => row.id, header: 'ID' },
      {
        accessor: (row) => row.createdAt.toISOString(),
        header: 'Creado el',
      },
      { accessor: (row) => row.date, header: 'Fecha' },
      { accessor: (row) => row.category, header: 'Categoría' },
      { accessor: (row) => row.status, header: 'Estado' },
      { accessor: (row) => row.notes, header: 'Descripción' },
      {
        accessor: (row) =>
          row.type === MovementType.OUTFLOW
            ? NumberFormat.fromCents(row.amount)
            : null,
        header: 'Egreso',
      },
      {
        accessor: (row) =>
          row.type === MovementType.INFLOW
            ? NumberFormat.fromCents(row.amount)
            : null,
        header: 'Ingreso',
      },
    ]);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${query.filename}"`,
    );

    stream.pipe(res);
  }

  @ApiPaginatedResponse(MovementPaginatedResponseDto)
  @Get()
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
  ): Promise<
    PaginatedDataResponseDto<
      MovementPaginatedResponseDto,
      MovementPaginatedExtraResponseDto
    >
  > {
    const result = await this.movementRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: result.data.map((movement) => ({
        amount: movement.amount,
        category: movement.category,
        createdAt: movement.createdAt.toISOString(),
        date: movement.date,
        id: movement.id,
        mode: movement.mode,
        notes: movement.notes,
        paymentId: movement.paymentId,
        status: movement.status,
        type: movement.type,
      })),
      extra: {
        totalAmount: result.extra?.totalAmount ?? 0,
        totalAmountInflow: result.extra?.totalAmountInflow ?? 0,
        totalAmountOutflow: result.extra?.totalAmountOutflow ?? 0,
      },
      total: result.total,
    };
  }

  @Get('statistics')
  public async getStatistics(
    @Query() query: MovementStatisticsQueryRequestDto,
  ): Promise<MovementStatisticsResponseDto> {
    const data = await this.movementRepository.findForStatistics({
      dateRange: query.dateRange,
      includePreviousBalance: !!query.dateRange,
    });

    return {
      balance: data.balance,
      total: data.cumulativeTotal,
      totalInflow: data.totalInflow,
      totalOutflow: data.totalOutflow,
    };
  }

  @Get(':id')
  public async getById(
    @Param() params: ParamIdRequestDto,
  ): Promise<MovementResponseDto> {
    const movement = await this.movementRepository.findByIdReadModel(
      UniqueId.raw({ value: params.id }),
    );

    if (!movement) {
      throw new NotFoundException();
    }

    return {
      amount: movement.amount,
      category: movement.category,
      createdAt: movement.createdAt.toISOString(),
      createdBy: movement.createdBy,
      date: movement.date,
      id: movement.id,
      mode: movement.mode,
      notes: movement.notes,
      paymentId: movement.paymentId,
      status: movement.status,
      type: movement.type,
      updatedAt: movement.updatedAt.toISOString(),
      updatedBy: movement.updatedBy,
      voidedAt: movement.voidedAt ? movement.voidedAt.toISOString() : null,
      voidedBy: movement.voidedBy,
      voidReason: movement.voidReason,
    };
  }

  @Patch(':id/void')
  public async void(
    @Param() params: ParamIdRequestDto,
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
