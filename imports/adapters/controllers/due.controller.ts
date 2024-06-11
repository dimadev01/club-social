import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { CreateDueRequestDto } from '@adapters/dtos/create-due-request.dto';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid.request.dto';
import { GetPendingDuesRequestDto } from '@adapters/dtos/get-pending-dues-request.dto';
import { UpdateDueRequestDto } from '@adapters/dtos/update-due-request.dto';
import { VoidDueRequestDto } from '@adapters/dtos/void-due-request.dto';
import { DIToken } from '@application/common/di/tokens.di';
import { DueGridDto } from '@application/dues/dtos/due-grid.dto';
import { DueDto } from '@application/dues/dtos/due.dto';
import { CreateDueUseCase } from '@application/dues/use-cases/create-due/create-due.use-case';
import { GetDueUseCase } from '@application/dues/use-cases/get-due/get-due.use-case';
import { GetDuesGridUseCase } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.use-case';
import { GetPendingDuesUseCase } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.use-case';
import { UpdateDueUseCase } from '@application/dues/use-cases/update-due/update-due.use-case';
import { VoidDueUseCase } from '@application/dues/use-cases/void-due/void-due.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';

@injectable()
export class DueController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _create: CreateDueUseCase,
    private readonly _update: UpdateDueUseCase,
    private readonly _getOne: GetDueUseCase,
    private readonly _getGrid: GetDuesGridUseCase,
    private readonly _getPending: GetPendingDuesUseCase,
    private readonly _void: VoidDueUseCase,
  ) {
    super(logger);
  }

  public async create(request: CreateDueRequestDto): Promise<DueDto[]> {
    return this.execute({
      classType: CreateDueRequestDto,
      request,
      useCase: this._create,
    });
  }

  public async get(request: GetOneByIdRequestDto): Promise<DueDto> {
    return this.execute({
      classType: GetOneByIdRequestDto,
      request,
      useCase: this._getOne,
    });
  }

  public async getGrid(
    request: GetDuesGridRequestDto,
  ): Promise<FindPaginatedResponse<DueGridDto>> {
    return this.execute({
      classType: GetDuesGridRequestDto,
      request,
      useCase: this._getGrid,
    });
  }

  public async getPending(
    request: GetPendingDuesRequestDto,
  ): Promise<DueDto[]> {
    return this.execute({
      classType: GetPendingDuesRequestDto,
      request,
      useCase: this._getPending,
    });
  }

  public async update(request: UpdateDueRequestDto): Promise<DueDto> {
    return this.execute({
      classType: UpdateDueRequestDto,
      request,
      useCase: this._update,
    });
  }

  public async void(request: VoidDueRequestDto): Promise<void> {
    await this.execute({
      classType: VoidDueRequestDto,
      request,
      useCase: this._void,
    });
  }
}
