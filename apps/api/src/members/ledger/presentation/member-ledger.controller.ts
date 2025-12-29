import type { Response } from 'express';

import { NumberFormat } from '@club-social/shared/lib';
import {
  MemberLedgerEntrySource,
  MemberLedgerEntrySourceLabel,
  MemberLedgerEntryStatus,
  MemberLedgerEntryStatusLabel,
  MemberLedgerEntryType,
  MemberLedgerEntryTypeLabel,
} from '@club-social/shared/members';
import {
  Controller,
  Get,
  Header,
  Inject,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';

import { CsvService } from '@/infrastructure/csv/csv.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { ExportDataRequestDto } from '@/shared/presentation/dto/export-request.dto';
import { GetPaginatedDataRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedDataResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdReqResDto } from '@/shared/presentation/dto/param-id.dto';

import {
  MEMBER_LEDGER_REPOSITORY_PROVIDER,
  type MemberLedgerRepository,
} from '../member-ledger.repository';
import {
  MemberLedgerEntryPaginatedExtraResponseDto,
  MemberLedgerEntryPaginatedResponseDto,
} from './dto/member-ledger-entry-paginated.dto';
import { MemberLedgerEntryResponseDto } from './dto/member-ledger-entry-response.dto';

@Controller('member-ledger')
export class MemberLedgerController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MEMBER_LEDGER_REPOSITORY_PROVIDER)
    private readonly memberLedgerRepository: MemberLedgerRepository,
    private readonly csvService: CsvService,
  ) {
    super(logger);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  public async export(
    @Query() query: ExportDataRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const entries = await this.memberLedgerRepository.findForExport({
      filters: query.filters,
      sort: query.sort,
    });

    const stream = this.csvService.generateStream(entries, [
      { accessor: (row) => row.id, header: 'ID' },
      { accessor: (row) => row.createdAt.toISOString(), header: 'Creado el' },
      { accessor: (row) => row.date, header: 'Fecha' },
      { accessor: (row) => row.memberFullName, header: 'Socio' },
      {
        accessor: (row) =>
          MemberLedgerEntryTypeLabel[row.type as MemberLedgerEntryType],
        header: 'Tipo',
      },
      {
        accessor: (row) =>
          MemberLedgerEntrySourceLabel[row.source as MemberLedgerEntrySource],
        header: 'Origen',
      },
      {
        accessor: (row) =>
          MemberLedgerEntryStatusLabel[row.status as MemberLedgerEntryStatus],
        header: 'Estado',
      },
      {
        accessor: (row) => NumberFormat.fromCents(row.amount),
        header: 'Monto',
      },
      { accessor: (row) => row.notes ?? '', header: 'Notas' },
    ]);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${query.filename}"`,
    );

    stream.pipe(res);
  }

  @ApiPaginatedResponse(MemberLedgerEntryPaginatedResponseDto)
  @Get()
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
  ): Promise<
    PaginatedDataResponseDto<
      MemberLedgerEntryPaginatedResponseDto,
      MemberLedgerEntryPaginatedExtraResponseDto
    >
  > {
    const result = await this.memberLedgerRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: result.data.map((entry) => ({
        amount: entry.amount,
        createdAt: entry.createdAt.toISOString(),
        date: entry.date,
        id: entry.id,
        memberFullName: entry.memberFullName,
        memberId: entry.memberId,
        notes: entry.notes,
        paymentId: entry.paymentId,
        source: entry.source as MemberLedgerEntrySource,
        status: entry.status as MemberLedgerEntryStatus,
        type: entry.type as MemberLedgerEntryType,
      })),
      extra: {
        balance: result.extra?.balance ?? 0,
      },
      total: result.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() params: ParamIdReqResDto,
  ): Promise<MemberLedgerEntryResponseDto> {
    const entry = await this.memberLedgerRepository.findDetailById(params.id);

    if (!entry) {
      throw new NotFoundException('Entrada de libro mayor no encontrada');
    }

    return {
      amount: entry.amount,
      createdAt: entry.createdAt.toISOString(),
      createdBy: entry.createdBy,
      date: entry.date,
      id: entry.id,
      memberFullName: entry.memberName,
      memberId: entry.memberId,
      notes: entry.notes,
      paymentId: entry.paymentId,
      reversalOfId: entry.reversalOfId,
      source: entry.source as MemberLedgerEntrySource,
      status: entry.status as MemberLedgerEntryStatus,
      type: entry.type as MemberLedgerEntryType,
      updatedAt: entry.updatedAt.toISOString(),
      updatedBy: entry.updatedBy,
    };
  }
}
