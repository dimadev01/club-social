import type { Response } from 'express';

import {
  DueCategory,
  DueCategoryLabel,
  DueStatusLabel,
} from '@club-social/shared/dues';
import { UserStatusLabel } from '@club-social/shared/users';
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
import { PaymentDueDetailWithPaymentDto } from '@/payment-dues/presentation/dto/payment-due-detail.dto';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { ExportRequestDto } from '@/shared/presentation/dto/export-request.dto';
import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateDueUseCase } from '../application/create-due/create-due.use-case';
import { UpdateDueUseCase } from '../application/update-due/update-due.use-case';
import { VoidDueUseCase } from '../application/void-due/void-due.use-case';
import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '../domain/due.repository';
import { CreateDueRequestDto } from './dto/create-due.dto';
import { DueDetailDto } from './dto/due-detail.dto';
import { DuePaginatedDto, DuePaginatedExtraDto } from './dto/due-paginated.dto';
import { DuePendingStatisticsDto } from './dto/due-pending-statistics.dto';
import { PendingDueDto } from './dto/pending-due.dto';
import { UpdateDueDto } from './dto/update-due.dto';
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
  ): Promise<ParamIdDto> {
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
    @Param() request: ParamIdDto,
    @Body() body: UpdateDueDto,
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
    @Param() request: ParamIdDto,
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
    @Query() query: ExportRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.dueRepository.findForExport({
      filters: query.filters,
      sort: query.sort,
    });

    const stream = this.csvService.generateStream(data, [
      { accessor: (row) => row.due.id.value, header: 'ID' },
      {
        accessor: (row) => row.due.createdAt?.toISOString() ?? '',
        header: 'Creado el',
      },
      {
        accessor: (row) => row.due.date.value,
        header: 'Fecha',
      },
      {
        accessor: (row) => row.user.name.fullName,
        header: 'Socio',
      },
      {
        accessor: (row) => DueCategoryLabel[row.due.category],
        header: 'Categoría',
      },
      {
        accessor: (row) => row.due.amount.toDollars(),
        header: 'Monto',
      },
      {
        accessor: (row) => DueStatusLabel[row.due.status],
        header: 'Estado',
      },
      {
        accessor: (row) => UserStatusLabel[row.user.status],
        header: 'Estado Socio',
      },
    ]);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${query.filename}"`,
    );

    stream.pipe(res);
  }

  @ApiPaginatedResponse(DuePaginatedDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<DuePaginatedDto, DuePaginatedExtraDto>> {
    const dues = await this.dueRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: dues.data.map(({ due, member, user }) => ({
        amount: due.amount.toCents(),
        category: due.category,
        createdAt: due.createdAt?.toISOString() ?? '',
        date: due.date.value,
        id: due.id.value,
        memberId: member.id.value,
        memberName: user.name.fullName,
        status: due.status,
        userStatus: user.status,
      })),
      extra: {
        totalAmount: dues.extra?.totalAmount ?? 0,
      },
      total: dues.total,
    };
  }

  @Get('pending-statistics')
  public async getPendingStatistics(): Promise<DuePendingStatisticsDto> {
    const dues = await this.dueRepository.findPending();

    const categories = Object.values(DueCategory).reduce(
      (acc, category) => {
        const items = dues.filter((due) => due.category === category);
        acc[category] = sumBy(items, (due) => due.amount.toCents());

        return acc;
      },
      {} as Record<DueCategory, number>,
    );
    const total = sumBy(dues, (due) => due.amount.toCents());

    return {
      categories,
      total,
    };
  }

  @Get('pending')
  public async getPending(
    @Query('memberId') memberId: string,
  ): Promise<PendingDueDto[]> {
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

  @Get(':id/payments')
  public async getPaymentDues(
    @Param() request: ParamIdDto,
  ): Promise<PaymentDueDetailWithPaymentDto[]> {
    const data = await this.dueRepository.findSettlementsModel(
      UniqueId.raw({ value: request.id }),
    );

    return data.map(({ payment, settlement }) => ({
      amount: settlement.amount.toCents(),
      dueId: settlement.dueId.value,
      paymentAmount: payment.amount.toCents(),
      paymentDate: payment.date.value,
      paymentId: settlement.paymentId?.value ?? '',
      paymentReceiptNumber: payment.receiptNumber,
      paymentStatus: payment.status,
      status: settlement.status,
    }));
  }

  @Get(':id')
  public async getById(@Param() request: ParamIdDto): Promise<DueDetailDto> {
    const data = await this.dueRepository.findOneModel(
      UniqueId.raw({ value: request.id }),
    );

    if (!data) {
      throw new NotFoundException();
    }

    const { due, member, user } = data;

    return {
      amount: due.amount.toCents(),
      category: due.category,
      createdAt: due.createdAt?.toISOString() ?? '',
      createdBy: due.createdBy ?? '',
      date: due.date.value,
      id: due.id.value,
      memberCategory: member.category,
      memberId: member.id.value,
      memberName: user.name.fullName,
      notes: due.notes,
      status: due.status,
      updatedAt: due.updatedAt?.toISOString() ?? '',
      updatedBy: due.updatedBy,
      userStatus: user.status,
      voidedAt: due.voidedAt?.toISOString() ?? null,
      voidedBy: due.voidedBy ?? null,
      voidReason: due.voidReason ?? null,
    };
  }
}
