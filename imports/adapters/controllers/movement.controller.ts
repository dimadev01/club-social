import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { DIToken } from '@application/common/di/tokens.di';
import { MovementGridDto } from '@application/movements/dtos/movement-grid.dto';
import { GetMovementsGridUseCase } from '@application/movements/use-cases/get-movements-grid/get-movements-grid.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';

@injectable()
export class MovementController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _getGrid: GetMovementsGridUseCase,
  ) {
    super(logger);
  }

  public async getGrid(
    request: GetGridRequestDto,
  ): Promise<FindPaginatedResponse<MovementGridDto>> {
    return this.execute({
      classType: GetGridRequestDto,
      request,
      useCase: this._getGrid,
    });
  }
}
