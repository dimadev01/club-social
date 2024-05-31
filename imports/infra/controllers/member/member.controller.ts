import type { ClientSession } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { CreateMemberUseCase } from '@domain/members/use-cases/create-member/create-member.use-case';
import { GetMemberUseCase } from '@domain/members/use-cases/get-member/get-member.use.case';
import { GetMembersUseCase } from '@domain/members/use-cases/get-members/get-members.use-case';
import { GetMembersGridUseCase } from '@domain/members/use-cases/get-members-grid/get-members-grid.use-case';
import { GetMembersToExportUseCase } from '@domain/members/use-cases/get-members-to-export/get-members-to-export.use-case';
import { UpdateMemberNewUseCase } from '@domain/members/use-cases/update-member-new/update-member.use-case';
import { BaseController } from '@infra/controllers/base.controller';
import { CreateMemberRequestDto } from '@infra/controllers/member/create-member-request.dto';
import { GetMembersGridRequestDto } from '@infra/controllers/member/get-members-grid-request.dto';
import { GetMembersRequestDto } from '@infra/controllers/member/get-members-request.dto';
import { UpdateMemberRequestDto } from '@infra/controllers/member/update-member-request.dto';
import { GetModelRequestDto } from '@infra/controllers/types/get-model-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class MemberController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    @inject(CreateMemberUseCase)
    private readonly _create: CreateMemberUseCase<ClientSession>,
    @inject(GetMemberUseCase)
    private readonly _getOne: GetMemberUseCase,
    @inject(GetMembersUseCase)
    private readonly _get: GetMembersUseCase,
    @inject(GetMembersGridUseCase)
    private readonly _getGrid: GetMembersGridUseCase,
    @inject(GetMembersToExportUseCase)
    private readonly _getToExport: GetMembersToExportUseCase,
    @inject(UpdateMemberNewUseCase)
    private readonly _update: UpdateMemberNewUseCase<ClientSession>,
  ) {
    super(logger);
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.MembersCreate]: (request: CreateMemberRequestDto) =>
        this.execute({
          classType: CreateMemberRequestDto,
          request,
          useCase: this._create,
        }),

      [MeteorMethodEnum.MembersGetOne]: (request: GetModelRequestDto) =>
        this.execute({
          classType: GetModelRequestDto,
          request,
          useCase: this._getOne,
        }),

      [MeteorMethodEnum.MembersGet]: (request: GetMembersRequestDto) =>
        this.execute({
          classType: GetMembersRequestDto,
          request,
          useCase: this._get,
        }),

      [MeteorMethodEnum.MembersGetGrid]: (request: GetMembersGridRequestDto) =>
        this.execute({
          classType: GetMembersGridRequestDto,
          request,
          useCase: this._getGrid,
        }),

      [MeteorMethodEnum.MembersGetToExport]: (
        request: GetMembersGridRequestDto,
      ) =>
        this.execute({
          classType: GetMembersGridRequestDto,
          request,
          useCase: this._getToExport,
        }),

      [MeteorMethodEnum.MembersUpdate]: (request: UpdateMemberRequestDto) =>
        this.execute({
          classType: UpdateMemberRequestDto,
          request,
          useCase: this._update,
        }),
    });
  }
}
