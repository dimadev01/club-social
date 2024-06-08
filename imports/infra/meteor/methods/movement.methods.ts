import { injectable } from 'tsyringe';

import { GetGridRequestDto } from '@adapters/common/dtos/get-grid-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { MovementController } from '@adapters/controllers/movement.controller';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';

@injectable()
export class MovementMethods extends MeteorMethods {
  public constructor(private readonly _controller: MovementController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MovementsGetGrid]: (req: GetGridRequestDto) =>
        this._controller.getGrid(req),
    });
  }
}
