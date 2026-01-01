import type { Response } from 'express';

import {
  DueCategory,
  DueCategoryLabel,
  DueStatusLabel,
} from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import { MemberStatusLabel } from '@club-social/shared/members';
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
import { sumBy } from 'es-toolkit/compat';

import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import { CsvService } from '@/infrastructure/csv/csv.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { DateRangeRequestDto } from '@/shared/presentation/dto/date-range-request.dto';
import { ExportDataRequestDto } from '@/shared/presentation/dto/export-request.dto';
import { GetPaginatedDataRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedDataResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdReqResDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateDueUseCase } from '../application/create-due.use-case';
import { UpdateDueUseCase } from '../application/update-due.use-case';
import { VoidDueUseCase } from '../application/void-due.use-case';
import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '../domain/due.repository';
import { CreateDueRequestDto } from './dto/create-due.dto';
import {
  DuePaginatedExtraResponseDto,
  DuePaginatedResponseDto,
} from './dto/due-paginated.dto';
import { DuePendingStatisticsResponseDto } from './dto/due-pending-statistics.dto';
import { DueResponseDto } from './dto/due-response.dto';
import { PendingDueResponseDto } from './dto/pending-due.dto';
import { UpdateDueRequestDto } from './dto/update-due.dto';
import { VoidDueRequestDto } from './dto/void-due.dto';

@Controller('dues')
export class DuesController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createDueUseCase: CreateDueUseCase,
    private readonly updateDueUseCase: UpdateDueUseCase,
    private readonly voidDueUseCase: VoidDueUseCase,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    private readonly csvService: CsvService,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() body: CreateDueRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdReqResDto> {
    const { id } = this.handleResult(
      await this.createDueUseCase.execute({
        amount: body.amount,
        category: body.category,
        createdBy: session.user.name,
        date: body.date,
        memberId: body.memberId,
        notes: body.notes,
      }),
    );

    return { id: id.value };
  }

  @Patch(':id')
  public async update(
    @Param() request: ParamIdReqResDto,
    @Body() body: UpdateDueRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.updateDueUseCase.execute({
        amount: body.amount,
        id: request.id,
        notes: body.notes,
        updatedBy: session.user.name,
      }),
    );
  }

  @Patch(':id/void')
  public async void(
    @Param() request: ParamIdReqResDto,
    @Body() body: VoidDueRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.voidDueUseCase.execute({
        id: request.id,
        voidedBy: session.user.name,
        voidReason: body.voidReason,
      }),
    );
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  public async export(
    @Query() query: ExportDataRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const dues = await this.dueRepository.findForExport({
      filters: query.filters,
      sort: query.sort,
    });

    const stream = this.csvService.generateStream(dues, [
      { accessor: (row) => row.id, header: 'ID' },
      {
        accessor: (row) => row.createdAt.toISOString(),
        header: 'Creado el',
      },
      {
        accessor: (row) => row.date,
        header: 'Fecha',
      },
      {
        accessor: (row) => row.member.name,
        header: 'Socio',
      },
      {
        accessor: (row) => DueCategoryLabel[row.category],
        header: 'Categoría',
      },
      {
        accessor: (row) => NumberFormat.fromCents(row.amount),
        header: 'Monto',
      },
      {
        accessor: (row) => DueStatusLabel[row.status],
        header: 'Estado',
      },
      {
        accessor: (row) => MemberStatusLabel[row.member.status],
        header: 'Estado Socio',
      },
    ]);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${query.filename}"`,
    );

    stream.pipe(res);
  }

  @ApiPaginatedResponse(DuePaginatedResponseDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
  ): Promise<
    PaginatedDataResponseDto<
      DuePaginatedResponseDto,
      DuePaginatedExtraResponseDto
    >
  > {
    const data = await this.dueRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: data.data.map((due) => ({
        amount: due.amount,
        category: due.category,
        createdAt: due.createdAt.toISOString(),
        date: due.date,
        id: due.id,
        memberId: due.member.id,
        memberName: due.member.name,
        memberStatus: due.member.status,
        status: due.status,
      })),
      extra: {
        totalAmount: data.extra?.totalAmount ?? 0,
      },
      total: data.total,
    };
  }

  @Get('pending-statistics')
  public async getPendingStatistics(
    @Query() query: DateRangeRequestDto,
  ): Promise<DuePendingStatisticsResponseDto> {
    const dues = await this.dueRepository.findPending({
      dateRange: query.dateRange,
    });

    const categories = Object.values(DueCategory).reduce(
      (acc, category) => {
        const items = dues.filter((due) => due.category === category);
        acc[category] = sumBy(items, (due) => due.pendingAmount.toCents());

        return acc;
      },
      {} as Record<DueCategory, number>,
    );
    const total = sumBy(dues, (due) => due.pendingAmount.toCents());

    return {
      categories,
      total,
    };
  }

  @Get('pending')
  public async getPending(
    @Query('memberId') memberId: string,
  ): Promise<PendingDueResponseDto[]> {
    const dues = await this.dueRepository.findPendingByMemberId(
      UniqueId.raw({ value: memberId }),
    );

    return dues.map((due) => ({
      amount: due.amount.toCents(),
      category: due.category,
      date: due.date.value,
      id: due.id.value,
      status: due.status,
    }));
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdReqResDto,
  ): Promise<DueResponseDto> {
    const due = await this.dueRepository.findByIdReadModel(
      UniqueId.raw({ value: request.id }),
    );

    if (!due) {
      throw new NotFoundException();
    }

    return {
      amount: due.amount,
      category: due.category,
      createdAt: due.createdAt.toISOString(),
      createdBy: due.createdBy,
      date: due.date,
      id: due.id,
      member: {
        category: due.member.category,
        id: due.member.id,
        name: due.member.name,
        status: due.member.status,
      },
      notes: due.notes,
      settlements: due.dueSettlements.map((dueSettlement) => ({
        amount: dueSettlement.amount,
        dueId: dueSettlement.dueId,
        memberLedgerEntry: {
          date: dueSettlement.memberLedgerEntry.date,
          id: dueSettlement.memberLedgerEntry.id,
          source: dueSettlement.memberLedgerEntry.source,
        },
        payment: dueSettlement.payment
          ? { date: dueSettlement.payment.date, id: dueSettlement.payment.id }
          : null,
        status: dueSettlement.status,
      })),
      status: due.status,
      updatedAt: due.updatedAt.toISOString(),
      updatedBy: due.updatedBy,
      voidedAt: due.voidedAt ? due.voidedAt.toISOString() : null,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }
}
