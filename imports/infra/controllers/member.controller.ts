import type { ClientSession } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { CreateMemberResponse } from '@domain/members/use-cases/create-member/create-member.response';
import { CreateMemberUseCase } from '@domain/members/use-cases/create-member/create-member.use-case';
import { GetMemberGridResponse } from '@domain/members/use-cases/get-member/get-member-grid.response';
import { GetMemberResponse } from '@domain/members/use-cases/get-member/get-member.response';
import { GetMemberNewUseCase } from '@domain/members/use-cases/get-member/get-member.use.case';
import { GetMembersGridUseCase } from '@domain/members/use-cases/get-members-grid/get-members-grid.use-case';
import { UpdateMemberNewUseCase } from '@domain/members/use-cases/update-member-new/update-member.use-case';
import { BaseController } from '@infra/controllers/base.controller';
import { CreateMemberRequestDto } from '@infra/controllers/types/create-member-request.dto';
import { GetGridRequestDto } from '@infra/controllers/types/get-grid-request.dto';
import { GetGridResponse } from '@infra/controllers/types/get-grid-response.dto';
import { GetMemberRequestDto } from '@infra/controllers/types/get-member-request.dto';
import { UpdateMemberRequestDto } from '@infra/controllers/types/update-member-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class MemberController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    @inject(CreateMemberUseCase)
    private readonly _createMemberUseCase: CreateMemberUseCase<ClientSession>,
    @inject(GetMemberNewUseCase)
    private readonly _getMemberUseCase: GetMemberNewUseCase,
    @inject(GetMembersGridUseCase)
    private readonly _getMembersGridUseCase: GetMembersGridUseCase,
    @inject(UpdateMemberNewUseCase)
    private readonly _updateMemberUseCase: UpdateMemberNewUseCase<ClientSession>,
  ) {
    super(logger);
  }

  private _getMember(
    request: GetMemberRequestDto,
  ): Promise<GetMemberResponse | null> {
    return this.execute({
      classType: GetMemberRequestDto,
      request,
      useCase: this._getMemberUseCase,
    });
  }

  private _getMembersGrid(
    request: GetGridRequestDto,
  ): Promise<GetGridResponse<GetMemberGridResponse>> {
    return this.execute({
      classType: GetGridRequestDto,
      request,
      useCase: this._getMembersGridUseCase,
    });
  }

  private _createMember(
    request: CreateMemberRequestDto,
  ): Promise<CreateMemberResponse> {
    return this.execute({
      classType: CreateMemberRequestDto,
      request,
      useCase: this._createMemberUseCase,
    });
  }

  private _updateMember(request: UpdateMemberRequestDto): Promise<null> {
    return this.execute({
      classType: UpdateMemberRequestDto,
      request,
      useCase: this._updateMemberUseCase,
    });
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MembersCreate]: this._createMember.bind(this),
      [MeteorMethodEnum.MembersUpdate]: this._updateMember.bind(this),
      [MeteorMethodEnum.MembersGetNew]: this._getMember.bind(this),
      [MeteorMethodEnum.MembersGetGrid]: this._getMembersGrid.bind(this),
    });
  }
}
