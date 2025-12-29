import type { Response } from 'express';

import { DueCategory } from '@club-social/shared/dues';
import { NumberFormat } from '@club-social/shared/lib';
import {
  PaymentStatisticsCategoryDto,
  PaymentStatusLabel,
} from '@club-social/shared/payments';
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
import { flatMap, meanBy, sumBy, uniqBy } from 'es-toolkit/compat';

import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
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
import { ParamIdReqResDto } from '@/shared/presentation/dto/param-id.dto';

import { CreatePaymentUseCase } from '../application/create-payment/create-payment.use-case';
import { VoidPaymentUseCase } from '../application/void-payment/void-payment.use-case';
import {
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '../domain/payment.repository';
import { CreatePaymentRequestDto } from './dto/create-payment.dto';
import {
  PaymentPaginatedExtraResponseDto,
  PaymentPaginatedResponseDto,
} from './dto/payment-paginated.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { GetPaymentStatisticsRequestDto } from './dto/payment-statistics-query.dto';
import { PaymentStatisticsResponseDto } from './dto/payment-statistics.dto';
import { VoidPaymentRequestDto } from './dto/void-payment.dto';

@Controller('payments')
export class PaymentsController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepository: PaymentRepository,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly voidPaymentUseCase: VoidPaymentUseCase,
    private readonly csvService: CsvService,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() body: CreatePaymentRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdReqResDto> {
    const { id } = this.handleResult(
      await this.createPaymentUseCase.execute({
        createdBy: session.user.name,
        date: body.date,
        dues: body.dues,
        memberId: body.memberId,
        notes: body.notes || null,
        receiptNumber: body.receiptNumber || null,
      }),
    );

    return { id: id.value };
  }

  @Patch(':id/void')
  public async void(
    @Param() request: ParamIdReqResDto,
    @Body() body: VoidPaymentRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.voidPaymentUseCase.execute({
        id: request.id,
        voidedBy: session.user.name,
        voidReason: body.voidReason,
      }),
    );
  }

  @ApiPaginatedResponse(PaymentPaginatedResponseDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
  ): Promise<
    PaginatedDataResponseDto<
      PaymentPaginatedResponseDto,
      PaymentPaginatedExtraResponseDto
    >
  > {
    const data = await this.paymentRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: data.data.map((payment) => ({
        amount: payment.amount,
        createdAt: payment.createdAt.toISOString(),
        createdBy: payment.createdBy,
        date: payment.date,
        id: payment.id,
        memberId: payment.member.id,
        memberName: payment.member.name,
        status: payment.status,
      })),
      extra: {
        totalAmount: data.extra?.totalAmount ?? 0,
      },
      total: data.total,
    };
  }

  @Get('statistics')
  public async getStatistics(
    @Query() query: GetPaymentStatisticsRequestDto,
  ): Promise<PaymentStatisticsResponseDto> {
    const payments = await this.paymentRepository.findForStatistics({
      dateRange: query.dateRange,
    });
    const dueSettlements = flatMap(payments, (s) => s.dueSettlements);

    const total = sumBy(payments, (s) => s.amount);
    const count = payments.length;

    const uniqueDues = uniqBy(dueSettlements, (ds) => ds.due.id);
    const paidDuesCount = uniqueDues.length;

    const average = meanBy(payments, (s) => s.amount);
    const categories = Object.values(DueCategory).reduce(
      (acc, category) => {
        const dueSettlementsInCategory = uniqueDues.filter(
          (ds) => ds.due.category === category,
        );

        if (dueSettlementsInCategory.length > 0) {
          const amount = sumBy(dueSettlementsInCategory, (ds) => ds.amount);
          const average = meanBy(dueSettlementsInCategory, (pd) => pd.amount);
          const count = dueSettlementsInCategory.length;
          acc[category] = { amount, average, count };
        } else {
          acc[category] = { amount: 0, average: 0, count: 0 };
        }

        return acc;
      },
      {} as Record<DueCategory, PaymentStatisticsCategoryDto>,
    );

    return {
      average,
      categories,
      count,
      paidDuesCount,
      total,
    };
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  public async export(
    @Query() query: ExportDataRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const payments = await this.paymentRepository.findForExport({
      filters: query.filters,
      sort: query.sort,
    });

    const stream = this.csvService.generateStream(payments, [
      { accessor: (row) => row.id, header: 'ID' },
      {
        accessor: (row) => row.createdAt?.toISOString() ?? '',
        header: 'Creado el',
      },
      { accessor: (row) => row.date, header: 'Fecha' },
      { accessor: (row) => row.member.name, header: 'Socio' },
      {
        accessor: (row) => NumberFormat.fromCents(row.amount),
        header: 'Monto',
      },
      {
        accessor: (row) => PaymentStatusLabel[row.status],
        header: 'Estado',
      },
    ]);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${query.filename}"`,
    );

    stream.pipe(res);
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdReqResDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findByIdReadModel(
      UniqueId.raw({ value: request.id }),
    );

    if (!payment) {
      throw new NotFoundException();
    }

    return {
      amount: payment.amount,
      createdAt: payment.createdAt?.toISOString() ?? '',
      createdBy: payment.createdBy,
      date: payment.date,
      id: payment.id,
      member: {
        id: payment.member.id,
        name: payment.member.name,
      },
      memberId: payment.member.id,
      memberName: payment.member.name,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      settlements: payment.dueSettlements.map((settlement) => ({
        amount: settlement.amount,
        due: {
          amount: settlement.due.amount,
          category: settlement.due.category,
          id: settlement.due.id,
        },
        memberLedgerEntry: {
          date: settlement.memberLedgerEntry.date,
          id: settlement.memberLedgerEntry.id,
        },
        status: settlement.status,
      })),
      status: payment.status,
      updatedAt: payment.updatedAt.toISOString(),
      updatedBy: payment.updatedBy,
      voidedAt: payment.voidedAt?.toISOString() ?? null,
      voidedBy: payment.voidedBy ?? null,
      voidReason: payment.voidReason ?? null,
    };
  }
}
