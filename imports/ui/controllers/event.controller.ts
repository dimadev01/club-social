import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { EventGridDto } from '@application/events/dtos/event-grid.dto';
import { GetEventsGridUseCase } from '@application/events/use-cases/get-events-grid/get-events-grid.use-case';
import { BaseController } from '@ui/common/controllers/base.controller';
import { GetEventsGridRequestDto } from '@ui/dtos/get-events-grid-request.dto';

@injectable()
export class EventController extends BaseController {
  public constructor(
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
    private readonly _getGrid: GetEventsGridUseCase,
  ) {
    super(logger);
  }

  public async getGrid(
    request: GetEventsGridRequestDto,
  ): Promise<FindPaginatedResponse<EventGridDto>> {
    return this.execute({
      classType: GetEventsGridRequestDto,
      request,
      useCase: this._getGrid,
    });
  }
}
