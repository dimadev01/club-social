import { container } from 'tsyringe';

import { CreateMovementUseCase } from '@application/movements/use-cases/create-movement/create-movement.use-case';
import { GetMovementUseCase } from '@application/movements/use-cases/get-movement/get-movement.use.case';
import { GetMovementsToExportUseCase } from '@application/movements/use-cases/get-movements-export/get-movements-export.use-case';
import { GetMovementsGridUseCase } from '@application/movements/use-cases/get-movements-grid/get-movements-grid.use-case';
import { GetMovementsTotalUseCase } from '@application/movements/use-cases/get-movements-totals/get-movements-totals.use-case';
import { UpdateMovementUseCase } from '@application/movements/use-cases/update-movement/update-movement.use-case';
import { VoidMovementUseCase } from '@application/movements/use-cases/void-movement/void-movement.use-case';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { VoidMovementMethodRequestDto } from '@infra/meteor/dtos/void-movement-method-request.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { CreateMovementRequestDto } from '@ui/dtos/create-movement-request.dto';
import { GetMovementsGridRequestDto } from '@ui/dtos/get-movements-grid-request.dto';
import { GetMovementsTotalsRequestDto } from '@ui/dtos/get-movements-totals-request.dto';
import { UpdateMovementRequestDto } from '@ui/dtos/update-movement-request.dto';
import { VoidMovementRequestDto } from '@ui/dtos/void-movement-request.dto';

export class MovementMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MovementsGetGrid]: (req: GetMovementsGridRequestDto) =>
        this.execute(
          container.resolve(GetMovementsGridUseCase),
          GetMovementsGridRequestDto,
          req,
        ),

      [MeteorMethodEnum.MovementsGetTotals]: (
        req: GetMovementsTotalsRequestDto,
      ) =>
        this.execute(
          container.resolve(GetMovementsTotalUseCase),
          GetMovementsTotalsRequestDto,
          req,
        ),

      [MeteorMethodEnum.MovementsGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(
          container.resolve(GetMovementUseCase),
          GetOneByIdRequestDto,
          req,
        ),

      [MeteorMethodEnum.MovementsCreate]: (req: CreateMovementRequestDto) =>
        this.execute(
          container.resolve(CreateMovementUseCase),
          CreateMovementRequestDto,
          req,
        ),

      [MeteorMethodEnum.MovementsUpdate]: (req: UpdateMovementRequestDto) =>
        this.execute(
          container.resolve(UpdateMovementUseCase),
          UpdateMovementRequestDto,
          req,
        ),

      [MeteorMethodEnum.MovementsGetToExport]: (
        req: GetMovementsGridRequestDto,
      ) =>
        this.execute(
          container.resolve(GetMovementsToExportUseCase),
          GetMovementsGridRequestDto,
          req,
        ),

      [MeteorMethodEnum.MovementsVoid]: (req: VoidMovementMethodRequestDto) =>
        this.execute(
          container.resolve(VoidMovementUseCase),
          VoidMovementRequestDto,
          { ...req, voidedBy: this.getCurrentUserName() },
        ),
    });
  }
}
