import { injectable } from 'tsyringe';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MovementController } from '@adapters/controllers/movement.controller';
import { CreateMovementRequestDto } from '@adapters/dtos/create-movement-request.dto';
import { GetMovementsGridRequestDto } from '@adapters/dtos/get-movements-grid-request.dto';
import { GetMovementsTotalsRequestDto } from '@adapters/dtos/get-movements-totals-request.dto';
import { UpdateMovementRequestDto } from '@adapters/dtos/update-movement-request.dto';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { VoidMovementMethodRequestDto } from '@infra/meteor/dtos/void-movement-method-request.dto';

@injectable()
export class MovementMethods extends MeteorMethods {
  public constructor(private readonly _controller: MovementController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MovementsGetGrid]: (req: GetMovementsGridRequestDto) =>
        this.execute(this._controller.getGrid.bind(this._controller), req),
      [MeteorMethodEnum.MovementsGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(this._controller.getOne.bind(this._controller), req),
      [MeteorMethodEnum.MovementsCreate]: (req: CreateMovementRequestDto) =>
        this.execute(this._controller.create.bind(this._controller), req),
      [MeteorMethodEnum.MovementsUpdate]: (req: UpdateMovementRequestDto) =>
        this.execute(this._controller.update.bind(this._controller), req),
      [MeteorMethodEnum.MovementsGetTotals]: (
        req: GetMovementsTotalsRequestDto,
      ) => this.execute(this._controller.getTotals.bind(this._controller), req),
      [MeteorMethodEnum.MovementsGetToExport]: (
        req: GetMovementsGridRequestDto,
      ) =>
        this.execute(this._controller.getToExport.bind(this._controller), req),
      [MeteorMethodEnum.MovementsVoid]: (req: VoidMovementMethodRequestDto) =>
        this.execute(this._controller.void.bind(this._controller), {
          ...req,
          voidedBy: this.getCurrentUserName(),
        }),
    });
  }
}
