import { injectable } from 'tsyringe';
import { CreateMemberRequestDto } from '@domain/members/use-cases/create-member/create-member-request.dto';
import { CreateMemberUseCase } from '@domain/members/use-cases/create-member/create-member.use-case';
import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { GetMemberUseCase } from '@domain/members/use-cases/get-member/get-member.use-case';
import { GetMembersRequestDto } from '@domain/members/use-cases/get-members/get-members-request.dto';
import { GetMembersUseCase } from '@domain/members/use-cases/get-members/get-members.use-case';
import { RemoveMemberRequestDto } from '@domain/members/use-cases/remove-member/remove-member-request.dto';
import { RemoveMemberUseCase } from '@domain/members/use-cases/remove-member/remove-member.use-case';
import { UpdateMemberRequestDto } from '@domain/members/use-cases/update-member/update-member-request.dto';
import { UpdateMemberUseCase } from '@domain/members/use-cases/update-member/update-member.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class MembersMethods extends BaseMethod {
  public constructor(
    private readonly _getMembersUseCase: GetMembersUseCase,
    private readonly _getMemberUseCase: GetMemberUseCase,
    private readonly _createMemberUseCase: CreateMemberUseCase,
    private readonly _removeMemberUseCase: RemoveMemberUseCase,
    private readonly _updateMemberUseCase: UpdateMemberUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.MembersGetGrid]: (request: GetMembersRequestDto) =>
        this.execute(this._getMembersUseCase, request),

      [MethodsEnum.MembersGet]: (request: GetMemberRequestDto) =>
        this.execute(this._getMemberUseCase, request),

      [MethodsEnum.MembersCreate]: (request: CreateMemberRequestDto) =>
        this.execute(this._createMemberUseCase, request),

      [MethodsEnum.MembersRemove]: (request: RemoveMemberRequestDto) =>
        this.execute(this._removeMemberUseCase, request),

      [MethodsEnum.MembersUpdate]: (request: UpdateMemberRequestDto) =>
        this.execute(this._updateMemberUseCase, request),
    });
  }
}
