import { injectable } from 'tsyringe';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { CreateMemberUseCase } from '@domain/members/use-cases/create-member/create-member.use-case';
import { DeleteMemberRequestDto } from '@domain/members/use-cases/delete-member/delete-member-request.dto';
import { DeleteMemberUseCase } from '@domain/members/use-cases/delete-member/delete-member.use-case';
import { GetMemberMovementsGridRequestDto } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.request.dto';
import { GetMemberMovementsUseCase } from '@domain/members/use-cases/get-member-movements/get-member-movements-grid.use-case';
import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { GetMemberUseCase } from '@domain/members/use-cases/get-member/get-member.use-case';
import { GetMembersForCsvRequestDto } from '@domain/members/use-cases/get-members-for-csv/get-members-for-csv-request.dto';
import { GetMembersForCsvUseCase } from '@domain/members/use-cases/get-members-for-csv/get-members-for-csv.use-case';
import { GetMembersGridUseCase } from '@domain/members/use-cases/get-members-grid/get-members-grid.use-case';
import { GetMembersUseCase } from '@domain/members/use-cases/get-members/get-members.use-case';
import { UpdateMemberRequestDto } from '@domain/members/use-cases/update-member/update-member-request.dto';
import { UpdateMemberUseCase } from '@domain/members/use-cases/update-member/update-member.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';

@injectable()
export class MemberMethod extends MeteorMethod {
  public constructor(
    private readonly _getMembersGrid: GetMembersGridUseCase,
    private readonly _getMembers: GetMembersUseCase,
    private readonly _getMembersForCsv: GetMembersForCsvUseCase,
    private readonly _getMember: GetMemberUseCase,
    private readonly _createMember: CreateMemberUseCase,
    private readonly _deleteMember: DeleteMemberUseCase,
    private readonly _updateMember: UpdateMemberUseCase,
    private readonly _getMemberMovements: GetMemberMovementsUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.MembersGetGrid]: (request: PaginatedRequestDto) =>
        this.execute(this._getMembersGrid, request, PaginatedRequestDto),

      [MethodsEnum.MembersGetAll]: () =>
        this.execute(this._getMembers, PaginatedRequestDto),

      [MethodsEnum.MembersGet]: (request: GetMemberRequestDto) =>
        this.execute(this._getMember, request, GetMemberRequestDto),

      [MethodsEnum.MembersCreate]: (request: CreateMemberRequestDto) =>
        this.execute(this._createMember, request, CreateMemberRequestDto),

      [MethodsEnum.MembersDelete]: (request: DeleteMemberRequestDto) =>
        this.execute(this._deleteMember, request, DeleteMemberRequestDto),

      [MethodsEnum.MembersUpdate]: (request: UpdateMemberRequestDto) =>
        this.execute(this._updateMember, request, UpdateMemberRequestDto),

      [MethodsEnum.MembersGetForCsv]: (request: GetMembersForCsvRequestDto) =>
        this.execute(
          this._getMembersForCsv,
          request,
          GetMembersForCsvRequestDto
        ),

      [MethodsEnum.MembersGetMovementsGrid]: (
        request: GetMemberMovementsGridRequestDto
      ) =>
        this.execute(
          this._getMemberMovements,
          request,
          GetMemberMovementsGridRequestDto
        ),
    });
  }
}
