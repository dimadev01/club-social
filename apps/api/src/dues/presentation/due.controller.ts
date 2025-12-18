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

import { CreateDueUseCase } from '../application/create-due/create-due.use-case';
import { UpdateDueUseCase } from '../application/update-due/update-due.use-case';
import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '../domain/due.repository';
import { DueEntity } from '../domain/entities/due.entity';
import { CreateDueRequestDto } from './dto/create-due.dto';
import { DueListRequestDto } from './dto/due-list.dto';
import { DueResponseDto } from './dto/due.dto';
import { UpdateDueRequestDto } from './dto/update-due.dto';

@Controller('dues')
export class DuesController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createDueUseCase: CreateDueUseCase,
    private readonly updateDueUseCase: UpdateDueUseCase,
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

  @ApiPaginatedResponse(DueResponseDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: DueListRequestDto,
  ): Promise<PaginatedResponseDto<DueResponseDto>> {
    const dues = await this.dueRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: dues.data.map((due) => this.toDto(due)),
      total: dues.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdDto,
  ): Promise<DueResponseDto | null> {
    const due = await this.dueRepository.findOneById(
      UniqueId.raw({ value: request.id }),
    );

    if (!due) {
      return null;
    }

    return this.toDto(due);
  }

  private toDto(due: DueEntity): DueResponseDto {
    return {
      amount: due.amount.toCents(),
      category: due.category,
      createdAt: due.createdAt.toISOString(),
      createdBy: due.createdBy,
      date: due.date.value,
      id: due.id.value,
      memberId: due.memberId.value,
      notes: due.notes,
      status: due.status,
      updatedAt: due.updatedAt.toISOString(),
      updatedBy: due.updatedBy,
      voidedAt: due.voidedAt ? due.voidedAt.toISOString() : null,
      voidedBy: due.voidedBy,
      voidReason: due.voidReason,
    };
  }
}
