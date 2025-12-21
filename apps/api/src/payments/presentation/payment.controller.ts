import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Session,
} from '@nestjs/common';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';

import { CreatePaymentUseCase } from '../application/create-payment/create-payment.use-case';
import { VoidPaymentUseCase } from '../application/void-payment/void-payment.use-case';
import {
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '../domain/payment.repository';
import { CreatePaymentRequestDto } from './dto/create-payment.dto';
import { PaymentDetailDto } from './dto/payment-detail.dto';
import { PaymentPaginatedDto } from './dto/payment-paginated.dto';
import { VoidPaymentRequestDto } from './dto/void-payment.dto';

@Controller('payments')
export class PaymentsController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly voidPaymentUseCase: VoidPaymentUseCase,
    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepository: PaymentRepository,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() body: CreatePaymentRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdDto> {
    const { id } = this.handleResult(
      await this.createPaymentUseCase.execute({
        createdBy: session.user.name,
        date: body.date,
        notes: body.notes,
        paymentDues: body.paymentDues,
        receiptNumber: body.receiptNumber,
      }),
    );

    return { id: id.value };
  }

  @Post(':id/void')
  public async void(
    @Param() request: ParamIdDto,
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

  @ApiPaginatedResponse(PaymentPaginatedDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<PaymentPaginatedDto>> {
    const payments = await this.paymentRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: payments.data.map((payment) => ({
        amount: payment.amount.toCents(),
        createdAt: payment.createdAt.toISOString(),
        createdBy: payment.createdBy,
        date: payment.date.value,
        id: payment.id.value,
        memberId: '',
        memberName: '',
        status: payment.status,
      })),
      total: payments.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdDto,
  ): Promise<null | PaymentDetailDto> {
    const payment = await this.paymentRepository.findOneById(
      UniqueId.raw({ value: request.id }),
    );

    if (!payment) {
      return null;
    }

    return {
      amount: payment.amount.toCents(),
      createdAt: payment.createdAt.toISOString(),
      createdBy: payment.createdBy,
      date: payment.date.value,
      id: payment.id.value,
      notes: payment.notes,
      paymentDues: payment.affectedDueIds.map((dueId) => ({
        amount: 0,
        dueId: dueId.value,
        paymentId: payment.id.value,
      })),
      status: payment.status,
    };
  }
}
