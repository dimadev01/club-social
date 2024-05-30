import type { ClientSession } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { CreateMemberResponse } from '@domain/members/use-cases/create-member/create-member.response';
import { CreateMemberUseCase } from '@domain/members/use-cases/create-member/create-member.use-case';
import { GetMemberResponse } from '@domain/members/use-cases/get-member/get-member.response';
import { GetMemberUseCase } from '@domain/members/use-cases/get-member/get-member.use.case';
import { GetMembersUseCase } from '@domain/members/use-cases/get-members/get-members.use-case';
import { GetMembersGridUseCase } from '@domain/members/use-cases/get-members-grid/get-members-grid.use-case';
import { GetMembersToExportUseCase } from '@domain/members/use-cases/get-members-to-export/get-members-to-export.use-case';
import { UpdateMemberNewUseCase } from '@domain/members/use-cases/update-member-new/update-member.use-case';
import { BaseController } from '@infra/controllers/base.controller';
import { CreateMemberRequestDto } from '@infra/controllers/types/create-member-request.dto';
import { GetMemberRequestDto } from '@infra/controllers/types/get-member-request.dto';
import { GetMembersGridRequestDto } from '@infra/controllers/types/get-members-grid-request.dto';
import { GetMembersRequestDto } from '@infra/controllers/types/get-members-request.dto';
import { UpdateMemberRequestDto } from '@infra/controllers/types/update-member-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class MemberController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    @inject(CreateMemberUseCase)
    private readonly _createMemberUseCase: CreateMemberUseCase<ClientSession>,
    @inject(GetMemberUseCase)
    private readonly _getMemberUseCase: GetMemberUseCase,
    @inject(GetMembersUseCase)
    private readonly _getMembersUseCase: GetMembersUseCase,
    @inject(GetMembersGridUseCase)
    private readonly _getMembersGridUseCase: GetMembersGridUseCase,
    @inject(GetMembersToExportUseCase)
    private readonly _getMembersToExportUseCase: GetMembersToExportUseCase,
    @inject(UpdateMemberNewUseCase)
    private readonly _updateMemberUseCase: UpdateMemberNewUseCase<ClientSession>,
  ) {
    super(logger);
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MembersCreate]: this._createMember.bind(this),
      [MeteorMethodEnum.MembersUpdate]: this._updateMember.bind(this),
      [MeteorMethodEnum.MembersGetOne]: this._getMember.bind(this),
      [MeteorMethodEnum.MembersGetGrid]: this._getMembersGrid.bind(this),
      [MeteorMethodEnum.MembersGet]: this._getMembers.bind(this),
      [MeteorMethodEnum.MembersGetToExport]:
        this._getMembersToExport.bind(this),
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

  private _getMember(
    request: GetMemberRequestDto,
  ): Promise<GetMemberResponse | null> {
    return this.execute({
      classType: GetMemberRequestDto,
      request,
      useCase: this._getMemberUseCase,
    });
  }

  private _getMembers(
    request: GetMembersRequestDto,
  ): Promise<GetMemberResponse[]> {
    return this.execute({
      classType: GetMembersRequestDto,
      request,
      useCase: this._getMembersUseCase,
    });
  }

  private _getMembersGrid(request: GetMembersGridRequestDto) {
    return this.execute({
      classType: GetMembersGridRequestDto,
      request,
      useCase: this._getMembersGridUseCase,
    });
  }

  private _getMembersToExport(request: GetMembersGridRequestDto) {
    return this.execute({
      classType: GetMembersGridRequestDto,
      request,
      useCase: this._getMembersToExportUseCase,
    });
  }

  private _updateMember(request: UpdateMemberRequestDto): Promise<null> {
    return this.execute({
      classType: UpdateMemberRequestDto,
      request,
      useCase: this._updateMemberUseCase,
    });
  }
}
