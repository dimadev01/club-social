import { injectable } from 'tsyringe';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { DueController } from '@adapters/controllers/due.controller';
import { CreateDueRequestDto } from '@adapters/dtos/create-due-request.dto';
import { GetDuesGridRequestDto } from '@adapters/dtos/get-dues-grid-request.dto';
import { GetDuesTotalsRequestDto } from '@adapters/dtos/get-dues-totals-request.dto';
import { GetPendingDuesRequestDto } from '@adapters/dtos/get-pending-dues-request.dto';
import { UpdateDueRequestDto } from '@adapters/dtos/update-due-request.dto';
import { RoleEnum } from '@domain/roles/role.enum';
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
        this.execute(this._controller.create.bind(this._controller), req),
      [MeteorMethodEnum.DuesUpdate]: (req: UpdateDueRequestDto) =>
        this.execute(this._controller.update.bind(this._controller), req),
      [MeteorMethodEnum.DuesGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(this._controller.get.bind(this._controller), req),
      [MeteorMethodEnum.DuesGetTotals]: (req: GetDuesTotalsRequestDto) =>
        this.execute(this._controller.getTotals.bind(this._controller), req),
      [MeteorMethodEnum.DuesGetToExport]: (req: GetDuesGridRequestDto) =>
        this.execute(this._controller.getToExport.bind(this._controller), req),
      [MeteorMethodEnum.DuesGetGrid]: (req: GetDuesGridRequestDto) => {
        const currentUser = this.getCurrentUser();

        if (currentUser.profile?.role === RoleEnum.MEMBER) {
          req.filterByMember.push(currentUser._id);
        }

        return this.execute(
          this._controller.getGrid.bind(this._controller),
          req,
        );
      },
      [MeteorMethodEnum.DuesGetPending]: (req: GetPendingDuesRequestDto) =>
        this.execute(this._controller.getPending.bind(this._controller), req),
      [MeteorMethodEnum.DuesVoid]: (req: VoidDueMethodRequestDto) =>
        this.execute(this._controller.void.bind(this._controller), {
          ...req,
          voidedBy: this.getCurrentUserName(),
        }),
    });
  }
}
