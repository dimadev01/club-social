import { injectable } from 'tsyringe';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { DueController } from '@adapters/controllers/due.controller';
import { CreateDueRequestDto } from '@adapters/dtos/create-due-request.dto';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid.request.dto';
import { GetPendingDuesRequestDto } from '@adapters/dtos/get-pending-dues-request.dto';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { VoidDueMethodRequestDto } from '@infra/meteor/dtos/void-due-method-request.dto';

@injectable()
export class DueMethods extends MeteorMethods {
  public constructor(private readonly _controller: DueController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.DuesCreate]: (req: CreateDueRequestDto) =>
        this._controller.create(req),
      [MeteorMethodEnum.DuesGet]: (req: GetOneByIdRequestDto) =>
        this._controller.get(req),
      [MeteorMethodEnum.DuesGetGrid]: (req: GetDuesGridRequestDto) =>
        this._controller.getGrid(req),
      [MeteorMethodEnum.DuesGetPending]: (req: GetPendingDuesRequestDto) =>
        this._controller.getPending(req),
      [MeteorMethodEnum.DuesVoid]: (req: VoidDueMethodRequestDto) =>
        this._controller.void({
          ...req,
          voidedBy: this.getCurrentUserName(),
        }),
    });
  }
}
