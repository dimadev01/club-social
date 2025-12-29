import {
  MemberLedgerEntrySource,
  MemberLedgerEntryStatus,
  MemberLedgerEntryType,
} from '@club-social/shared/members';
import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
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
  ) {
    super(logger);
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
        totalAmount: result.extra?.totalAmount ?? 0,
        totalAmountInflow: result.extra?.totalAmountInflow ?? 0,
        totalAmountOutflow: result.extra?.totalAmountOutflow ?? 0,
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
