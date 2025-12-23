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

import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import { PaymentDueDetailWithDueDto } from '@/payment-dues/presentation/dto/payment-due-detail.dto';
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
        memberId: body.memberId,
        notes: body.notes || null,
        paymentDues: body.paymentDues,
        receiptNumber: body.receiptNumber || null,
      }),
    );

    return { id: id.value };
  }

  @Patch(':id/void')
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
    const data = await this.paymentRepository.findPaginatedModel({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: data.data.map(({ member, payment, user }) => ({
        amount: payment.amount.toCents(),
        createdAt: payment.createdAt.toISOString(),
        createdBy: user.name,
        date: payment.date.value,
        id: payment.id.value,
        memberId: member.id.value,
        memberName: user.name,
        status: payment.status,
      })),
      total: data.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdDto,
  ): Promise<PaymentDetailDto> {
    const data = await this.paymentRepository.findOneModel(
      UniqueId.raw({ value: request.id }),
    );

    if (!data) {
      throw new NotFoundException();
    }

    const { member, payment, user } = data;

    return {
      amount: payment.amount.toCents(),
      createdAt: payment.createdAt.toISOString(),
      createdBy: payment.createdBy,
      date: payment.date.value,
      id: payment.id.value,
      memberId: member.id.value,
      memberName: user.name,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
      status: payment.status,
      updatedAt: payment.updatedAt.toISOString(),
      updatedBy: payment.updatedBy ?? null,
      userStatus: user.status,
      voidedAt: payment.voidedAt?.toISOString() ?? null,
      voidedBy: payment.voidedBy ?? null,
      voidReason: payment.voidReason ?? null,
    };
  }

  @Get(':id/dues')
  public async getPaymentDues(
    @Param() request: ParamIdDto,
  ): Promise<PaymentDueDetailWithDueDto[]> {
    const data = await this.paymentRepository.findPaymentDuesModel(
      UniqueId.raw({ value: request.id }),
    );

    return data.map(({ due, paymentDue }) => ({
      amount: paymentDue.amount.toCents(),
      dueAmount: due.amount.toCents(),
      dueCategory: due.category,
      dueDate: due.date.value,
      dueId: due.id.value,
      dueStatus: due.status,
      paymentId: paymentDue.paymentId.value,
      status: paymentDue.status,
    }));
  }
}
