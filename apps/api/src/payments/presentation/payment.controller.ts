import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';

import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';

import { CreatePaymentUseCase } from '../application/create-payment/create-payment.use-case';
import { UpdatePaymentUseCase } from '../application/update-payment/update-payment.use-case';
import { PaymentEntity } from '../domain/entities/payment.entity';
import {
  PAYMENT_REPOSITORY_PROVIDER,
  type PaymentRepository,
} from '../domain/payment.repository';
import { CreatePaymentRequestDto } from './dto/create-payment.dto';
import { PaymentListRequestDto } from './dto/payment-list.dto';
import { PaymentResponseDto } from './dto/payment.dto';
import { UpdatePaymentRequestDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    @Inject(PAYMENT_REPOSITORY_PROVIDER)
    private readonly paymentRepository: PaymentRepository,
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
        amount: new Decimal(body.amount),
        createdBy: session.user.name,
        date: new Date(body.date),
        dueId: body.dueId,
        notes: body.notes,
      }),
    );

    return { id: id.value };
  }

  @Patch(':id')
  public async update(
    @Param() request: ParamIdDto,
    @Body() body: UpdatePaymentRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.updatePaymentUseCase.execute({
        amount: new Decimal(body.amount),
        date: new Date(body.date),
        id: request.id,
        notes: body.notes,
        updatedBy: session.user.name,
      }),
    );
  }

  @ApiPaginatedResponse(PaymentResponseDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaymentListRequestDto,
  ): Promise<PaginatedResponseDto<PaymentResponseDto>> {
    const payments = await this.paymentRepository.findPaginated({
      dueId: query.dueId,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: payments.data.map((payment) => this.toDto(payment)),
      total: payments.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdDto,
  ): Promise<null | PaymentResponseDto> {
    const payment = await this.paymentRepository.findOneById(
      UniqueId.raw({ value: request.id }),
    );

    if (!payment) {
      return null;
    }

    return this.toDto(payment);
  }

  private toDto(payment: PaymentEntity): PaymentResponseDto {
    return {
      amount: payment.amount.toNumber(),
      createdAt: payment.createdAt.toISOString(),
      createdBy: payment.createdBy,
      date: payment.date.toISOString(),
      dueId: payment.dueId.value,
      id: payment.id.value,
      notes: payment.notes,
      updatedAt: payment.updatedAt.toISOString(),
      updatedBy: payment.updatedBy,
    };
  }
}
