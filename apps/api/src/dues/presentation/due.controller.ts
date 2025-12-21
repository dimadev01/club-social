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

import { CreateDueUseCase } from '../application/create-due/create-due.use-case';
import { UpdateDueUseCase } from '../application/update-due/update-due.use-case';
import { VoidDueUseCase } from '../application/void-due/void-due.use-case';
import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '../domain/due.repository';
import { CreateDueRequestDto } from './dto/create-due.dto';
import { DueDetailDto } from './dto/due-detail.dto';
import { DuePaginatedDto } from './dto/due-paginated.dto';
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

  @ApiPaginatedResponse(DuePaginatedDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<DuePaginatedDto>> {
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
        createdAt: due.createdAt.toISOString(),
        date: due.date.value,
        id: due.id.value,
        memberId: member.id.value,
        memberName: user.name,
        status: due.status,
        userStatus: user.status,
      })),
      total: dues.total,
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
      createdAt: due.createdAt.toISOString(),
      date: due.date.value,
      id: due.id.value,
      memberId: member.id.value,
      memberName: user.name,
      notes: due.notes,
      status: due.status,
      userStatus: user.status,
    };
  }
}
