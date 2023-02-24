import { injectable } from 'tsyringe';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { CreateMemberUseCase } from '@domain/members/use-cases/create-member/create-member.use-case';
import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { GetMemberUseCase } from '@domain/members/use-cases/get-member/get-member.use-case';
import { GetMembersGridUseCase } from '@domain/members/use-cases/get-members-grid/get-members-grid.use-case';
import { GetMembersUseCase } from '@domain/members/use-cases/get-members/get-members.use-case';
import { RemoveMemberRequestDto } from '@domain/members/use-cases/remove-member/remove-member-request.dto';
import { RemoveMemberUseCase } from '@domain/members/use-cases/remove-member/remove-member.use-case';
import { UpdateMemberRequestDto } from '@domain/members/use-cases/update-member/update-member-request.dto';
import { UpdateMemberUseCase } from '@domain/members/use-cases/update-member/update-member.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';
import { PaginatedRequestDto } from '@kernel/paginated-request.dto';

@injectable()
export class MembersMethods extends BaseMethod {
  public constructor(
    private readonly _getMembersGrid: GetMembersGridUseCase,
    private readonly _getMembers: GetMembersUseCase,
    private readonly _getMember: GetMemberUseCase,
    private readonly _createMember: CreateMemberUseCase,
    private readonly _removeMember: RemoveMemberUseCase,
    private readonly _updateMember: UpdateMemberUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.MembersGetGrid]: (request: PaginatedRequestDto) =>
        this.execute(this._getMembersGrid, request),

      [MethodsEnum.MembersGetAll]: () => this.execute(this._getMembers),

      [MethodsEnum.MembersGet]: (request: GetMemberRequestDto) =>
        this.execute(this._getMember, request),

      [MethodsEnum.MembersCreate]: (request: CreateMemberRequestDto) =>
        this.execute(this._createMember, request),

      [MethodsEnum.MembersRemove]: (request: RemoveMemberRequestDto) =>
        this.execute(this._removeMember, request),

      [MethodsEnum.MembersUpdate]: (request: UpdateMemberRequestDto) =>
        this.execute(this._updateMember, request),
    });
  }
}
