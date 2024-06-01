import type { ClientSession } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { GetModelRequestDto } from '@adapters/common/dtos/get-model-request.dto';
import { CreateMemberRequestDto } from '@adapters/members/dtos/create-member-request.dto';
import { GetMembersGridRequestDto } from '@adapters/members/dtos/get-members-grid-request.dto';
import { GetMembersRequestDto } from '@adapters/members/dtos/get-members-request.dto';
import { UpdateMemberRequestDto } from '@adapters/members/dtos/update-member-request.dto';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { ILogger } from '@application/logger/logger.interface';
import { CreateMemberUseCase } from '@application/members/use-cases/create-member/create-member.use-case';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { GetMembersUseCase } from '@application/members/use-cases/get-members/get-members.use-case';
import { GetMembersGridUseCase } from '@application/members/use-cases/get-members-grid/get-members-grid.use-case';
import { GetMembersToExportUseCase } from '@application/members/use-cases/get-members-to-export/get-members-to-export.use-case';
import { UpdateMemberNewUseCase } from '@application/members/use-cases/update-member/update-member.use-case';
import { DIToken } from '@domain/common/tokens.di';

@injectable()
export class MemberController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _create: CreateMemberUseCase<ClientSession>,
    private readonly _getOne: GetMemberUseCase,
    private readonly _get: GetMembersUseCase,
    private readonly _getGrid: GetMembersGridUseCase,
    private readonly _getToExport: GetMembersToExportUseCase,
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
