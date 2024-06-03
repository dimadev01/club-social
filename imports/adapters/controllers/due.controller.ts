import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreateDueRequestDto } from '@adapters/dtos/create-due-request.dto';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid.request.dto';
import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { GetPendingDuesRequestDto } from '@adapters/dtos/get-pending-dues-request.dto';
import { DIToken } from '@application/common/di/tokens.di';
import { CreateDueUseCase } from '@application/dues/use-cases/create-due/create-due.use-case';
import { DeleteDueUseCase } from '@application/dues/use-cases/delete-due/delete-due.use-case';
import { GetDueUseCase } from '@application/dues/use-cases/get-due/get-due.use-case';
import { GetDuesGridUseCase } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.use-case';
import { GetPendingDuesUseCase } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';

@injectable()
export class DueController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _createDue: CreateDueUseCase,
    private readonly _getDue: GetDueUseCase,
    private readonly _deleteDue: DeleteDueUseCase,
    private readonly _getDuesGrid: GetDuesGridUseCase,
    private readonly _getPendingDues: GetPendingDuesUseCase,
  ) {
    super(logger);
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.DuesCreate]: (request: CreateDueRequestDto) =>
        this.execute({
          classType: CreateDueRequestDto,
          request,
          useCase: this._createDue,
        }),

      [MeteorMethodEnum.DuesGet]: (request: GetOneDtoByIdRequestDto) =>
        this.execute({
          classType: GetOneDtoByIdRequestDto,
          request,
          useCase: this._getDue,
        }),

      [MeteorMethodEnum.DuesDelete]: (request: GetOneDtoByIdRequestDto) =>
        this.execute({
          classType: GetOneDtoByIdRequestDto,
          request,
          useCase: this._deleteDue,
        }),

      [MeteorMethodEnum.DuesGetGrid]: (request: GetDuesGridRequestDto) =>
        this.execute({
          classType: GetDuesGridRequestDto,
          request,
          useCase: this._getDuesGrid,
        }),

      [MeteorMethodEnum.DuesGetPending]: (request: GetPendingDuesRequestDto) =>
        this.execute({
          classType: GetPendingDuesRequestDto,
          request,
          useCase: this._getPendingDues,
        }),
    });
  }
}
