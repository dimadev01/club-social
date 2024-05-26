import { injectable } from 'tsyringe';
import { CreateDueRequestDto } from '@domain/dues/use-cases/create-due/create-due-request.dto';
import { CreateDueUseCase } from '@domain/dues/use-cases/create-due/create-due.use-case';
import { DeleteDueRequestDto } from '@domain/dues/use-cases/delete-due/delete-due-request.dto';
import { DeleteDueUseCase } from '@domain/dues/use-cases/delete-due/delete-due.use-case';
import { GetDueRequestDto } from '@domain/dues/use-cases/get-due/get-due-request.dto';
import { GetDueUseCase } from '@domain/dues/use-cases/get-due/get-due.use-case';
import { GetDuesGridRequestDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.request.dto';
import { GetDuesGridUseCase } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.use-case';
import { GetPaidDuesRequestDto } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.request.dto';
import { GetPaidDuesUseCase } from '@domain/dues/use-cases/get-paid-dues/get-paid-dues.use-case';
import { GetPendingDuesRequestDto } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.request.dto';
import { GetPendingDuesByMemberUseCase } from '@domain/dues/use-cases/get-pending-dues/get-pending-dues.use-case';
import { RestoreDueRequestDto } from '@domain/dues/use-cases/restore-due/restore-due-request.dto';
import { RestoreDueUseCase } from '@domain/dues/use-cases/restore-due/restore-due.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class DueMethod extends MeteorMethod {
  public constructor(
    private readonly _getDuesGrid: GetDuesGridUseCase,
    private readonly _getPendingDuesByMember: GetPendingDuesByMemberUseCase,
    private readonly _getPaidDues: GetPaidDuesUseCase,
    private readonly _getDue: GetDueUseCase,
    private readonly _createDue: CreateDueUseCase,
    private readonly _deleteDue: DeleteDueUseCase,
    private readonly _restoreDue: RestoreDueUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.DuesGetGrid]: (request: GetDuesGridRequestDto) =>
        this.execute(this._getDuesGrid, request, GetDuesGridRequestDto),

      [MethodsEnum.DuesGetPaid]: (request: GetPaidDuesRequestDto) =>
        this.execute(this._getPaidDues, request, GetPaidDuesRequestDto),

      [MethodsEnum.DuesGetPendingByMember]: (
        request: GetPendingDuesRequestDto,
      ) =>
        this.execute(
          this._getPendingDuesByMember,
          request,
          GetPendingDuesRequestDto,
        ),

      [MethodsEnum.DuesGet]: (request: GetDueRequestDto) =>
        this.execute(this._getDue, request, GetDueRequestDto),

      [MethodsEnum.DuesCreate]: (request: CreateDueRequestDto) =>
        this.execute(this._createDue, request, CreateDueRequestDto),

      [MethodsEnum.DuesDelete]: (request: DeleteDueRequestDto) =>
        this.execute(this._deleteDue, request, DeleteDueRequestDto),

      [MethodsEnum.DuesRestore]: (request: RestoreDueRequestDto) =>
        this.execute(this._restoreDue, request, RestoreDueRequestDto),
    });
  }
}
