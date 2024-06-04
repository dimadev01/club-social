import { singleton } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { DueController } from '@adapters/controllers/due.controller';
import { CreateDueRequestDto } from '@adapters/dtos/create-due-request.dto';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid.request.dto';
import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { GetPendingDuesRequestDto } from '@adapters/dtos/get-pending-dues-request.dto';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';

@singleton()
export class DueMethods extends MeteorMethods {
  public constructor(private readonly _controller: DueController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.DuesCreate]: (request: CreateDueRequestDto) =>
        this._controller.create(request),
      [MeteorMethodEnum.DuesDelete]: (request: GetOneDtoByIdRequestDto) =>
        this._controller.delete(request),
      [MeteorMethodEnum.DuesGet]: (request: GetOneDtoByIdRequestDto) =>
        this._controller.get(request),
      [MeteorMethodEnum.DuesGetGrid]: (request: GetDuesGridRequestDto) =>
        this._controller.getGrid(request),
      [MeteorMethodEnum.DuesGetPending]: (request: GetPendingDuesRequestDto) =>
        this._controller.getPending(request),
    });
  }
}
