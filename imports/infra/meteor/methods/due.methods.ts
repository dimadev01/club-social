import { container } from 'tsyringe';

import { CreateDueUseCase } from '@application/dues/use-cases/create-due/create-due.use-case';
import { GetDueUseCase } from '@application/dues/use-cases/get-due/get-due.use-case';
import { GetDuesToExportUseCase } from '@application/dues/use-cases/get-dues-export/get-dues-export.use-case';
import { GetDuesGridUseCase } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.use-case';
import { GetDuesTotalUseCase } from '@application/dues/use-cases/get-dues-totals/get-dues-totals.use-case';
import { GetPendingDuesUseCase } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.use-case';
import { UpdateDueUseCase } from '@application/dues/use-cases/update-due/update-due.use-case';
import { VoidDueUseCase } from '@application/dues/use-cases/void-due/void-due.use-case';
import { RoleEnum } from '@domain/roles/role.enum';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { VoidDueMethodRequestDto } from '@infra/meteor/dtos/void-due-method-request.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreateDueRequestDto } from '@ui/dtos/create-due-request.dto';
import { GetDuesGridRequestDto } from '@ui/dtos/get-dues-grid-request.dto';
import { GetDuesTotalsRequestDto } from '@ui/dtos/get-dues-totals-request.dto';
import { GetPendingDuesRequestDto } from '@ui/dtos/get-pending-dues-request.dto';
import { UpdateDueRequestDto } from '@ui/dtos/update-due-request.dto';
import { VoidDueRequestDto } from '@ui/dtos/void-due-request.dto';

export class DueMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.DuesCreate]: (req: CreateDueRequestDto) =>
        this.execute(
          container.resolve(CreateDueUseCase),
          CreateDueRequestDto,
          req,
        ),

      [MeteorMethodEnum.DuesUpdate]: (req: UpdateDueRequestDto) =>
        this.execute(
          container.resolve(UpdateDueUseCase),
          UpdateDueRequestDto,
          req,
        ),

      [MeteorMethodEnum.DuesGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(
          container.resolve(GetDueUseCase),
          GetOneByIdRequestDto,
          req,
        ),

      [MeteorMethodEnum.DuesGetTotals]: (req: GetDuesTotalsRequestDto) =>
        this.execute(
          container.resolve(GetDuesTotalUseCase),
          GetDuesTotalsRequestDto,
          req,
        ),

      [MeteorMethodEnum.DuesGetToExport]: (req: GetDuesGridRequestDto) =>
        this.execute(
          container.resolve(GetDuesToExportUseCase),
          GetDuesGridRequestDto,
          req,
        ),

      [MeteorMethodEnum.DuesGetGrid]: (req: GetDuesGridRequestDto) => {
        const currentUser = this.getCurrentUser();

        if (currentUser.profile?.role === RoleEnum.MEMBER) {
          req.filterByMember.push(currentUser._id);
        }

        return this.execute(
          container.resolve(GetDuesGridUseCase),
          GetDuesGridRequestDto,
          req,
        );
      },

      [MeteorMethodEnum.DuesGetPending]: (req: GetPendingDuesRequestDto) =>
        this.execute(
          container.resolve(GetPendingDuesUseCase),
          GetPendingDuesRequestDto,
          req,
        ),

      [MeteorMethodEnum.DuesVoid]: (req: VoidDueMethodRequestDto) =>
        this.execute(container.resolve(VoidDueUseCase), VoidDueRequestDto, {
          ...req,
          voidedBy: this.getCurrentUserName(),
        }),
    });
  }
}
