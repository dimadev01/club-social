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
import { DuePaginatedModel } from '../domain/due.types';
import { DueEntity } from '../domain/entities/due.entity';
import { CreateDueRequestDto } from './dto/create-due.dto';
import { DueDetailDto } from './dto/due-detail.dto';
import { DueListRequestDto } from './dto/due-paginated-request.dto';
import { DuePaginatedDto } from './dto/due-paginated.dto';
import { UpdateDueDto } from './dto/update-due.dto';

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

  @ApiPaginatedResponse(DuePaginatedDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: DueListRequestDto,
  ): Promise<PaginatedResponseDto<DuePaginatedDto>> {
    const dues = await this.dueRepository.findPaginatedModel({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: dues.data.map((due) => this.toPaginatedModel(due)),
      total: dues.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdDto,
  ): Promise<DueDetailDto | null> {
    const due = await this.dueRepository.findOneById(
      UniqueId.raw({ value: request.id }),
    );

    if (!due) {
      return null;
    }

    return this.toDetailModel(due);
  }

  private toDetailModel(model: DueEntity): DueDetailDto {
    return {
      amount: model.amount.toCents(),
      category: model.category,
      createdAt: model.createdAt.toISOString(),
      date: model.date.value,
      id: model.id.value,
      memberId: model.memberId.value,
      notes: model.notes,
      status: model.status,
    };
  }

  private toPaginatedModel(model: DuePaginatedModel): DuePaginatedDto {
    return {
      amount: model.due.amount.toCents(),
      category: model.due.category,
      createdAt: model.due.createdAt.toISOString(),
      date: model.due.date.value,
      id: model.due.id.value,
      memberId: model.due.memberId.value,
      memberName: model.user.name,
      status: model.due.status,
      userStatus: model.user.status,
    };
  }
}
