import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { CreateMovementRequestDto } from '@adapters/dtos/create-movement-request.dto';
import { GetMovementsGridRequestDto } from '@adapters/dtos/get-movements-grid-request.dto';
import { GetMovementsTotalsRequestDto } from '@adapters/dtos/get-movements-totals-request.dto';
import { UpdateMovementRequestDto } from '@adapters/dtos/update-movement-request.dto';
import { VoidMovementRequestDto } from '@adapters/dtos/void-movement-request.dto';
import { DIToken } from '@application/common/di/tokens.di';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { CreateMovementUseCase } from '@application/movements/use-cases/create-movement/create-movement.use-case';
import { GetMovementUseCase } from '@application/movements/use-cases/get-movement/get-movement.use.case';
import { GetMovementsToExportUseCase } from '@application/movements/use-cases/get-movements-export/get-movements-export.use-case';
import { GetMovementsGridUseCase } from '@application/movements/use-cases/get-movements-grid/get-movements-grid.use-case';
import { GetMovementsTotalUseCase } from '@application/movements/use-cases/get-movements-totals/get-movements-totals.use-case';
import { UpdateMovementUseCase } from '@application/movements/use-cases/update-movement/update-movement.use-case';
import { VoidMovementUseCase } from '@application/movements/use-cases/void-movement/void-movement.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { GetMovementsTotalsResponse } from '@domain/movements/movement.repository';

@injectable()
export class MovementController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _getGrid: GetMovementsGridUseCase,
    private readonly _getOne: GetMovementUseCase,
    private readonly _create: CreateMovementUseCase,
    private readonly _update: UpdateMovementUseCase,
    private readonly _void: VoidMovementUseCase,
    private readonly _getToExport: GetMovementsToExportUseCase,
    private readonly _getTotals: GetMovementsTotalUseCase,
  ) {
    super(logger);
  }

  public async create(request: CreateMovementRequestDto): Promise<MovementDto> {
    return this.execute({
      classType: CreateMovementRequestDto,
      request,
      useCase: this._create,
    });
  }

  public async getGrid(
    request: GetMovementsGridRequestDto,
  ): Promise<FindPaginatedResponse<MovementGridDto>> {
    return this.execute({
      classType: GetMovementsGridRequestDto,
      request,
      useCase: this._getGrid,
    });
  }

  public async getOne(request: GetOneByIdRequestDto): Promise<MovementDto> {
    return this.execute({
      classType: GetOneByIdRequestDto,
      request,
      useCase: this._getOne,
    });
  }

  public async getToExport(
    request: GetMovementsGridRequestDto,
  ): Promise<MovementGridDto[]> {
    return this.execute({
      classType: GetMovementsGridRequestDto,
      request,
      useCase: this._getToExport,
    });
  }

  public async getTotals(
    request: GetMovementsTotalsRequestDto,
  ): Promise<GetMovementsTotalsResponse> {
    return this.execute({
      classType: GetMovementsTotalsRequestDto,
      request,
      useCase: this._getTotals,
    });
  }

  public async update(request: UpdateMovementRequestDto): Promise<MovementDto> {
    return this.execute({
      classType: UpdateMovementRequestDto,
      request,
      useCase: this._update,
    });
  }

  public async void(request: VoidMovementRequestDto): Promise<void> {
    await this.execute({
      classType: VoidMovementRequestDto,
      request,
      useCase: this._void,
    });
  }
}
