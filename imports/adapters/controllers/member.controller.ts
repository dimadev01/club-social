import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { CreateMemberRequestDto } from '@adapters/dtos/create-member-request.dto';
import { GetMembersGridRequestDto } from '@adapters/dtos/get-members-grid-request.dto';
import { GetMembersRequestDto } from '@adapters/dtos/get-members-request.dto';
import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { UpdateMemberRequestDto } from '@adapters/dtos/update-member-request.dto';
import { DIToken } from '@application/common/di/tokens.di';
import { CreateMemberUseCase } from '@application/members/use-cases/create-member/create-member.use-case';
import { GetMembersGridUseCase } from '@application/members/use-cases/ger-members-grid/get-members-grid.use-case';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { GetMembersUseCase } from '@application/members/use-cases/get-members/get-members.use-case';
import { GetMembersToExportUseCase } from '@application/members/use-cases/get-members-export/get-members-export.use-case';
import { UpdateMemberUseCase } from '@application/members/use-cases/update-member/update-member.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';

@injectable()
export class MemberController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _create: CreateMemberUseCase,
    private readonly _getOne: GetMemberUseCase,
    private readonly _get: GetMembersUseCase,
    private readonly _getGrid: GetMembersGridUseCase,
    private readonly _getToExport: GetMembersToExportUseCase,
    private readonly _update: UpdateMemberUseCase,
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

      [MeteorMethodEnum.MembersGetOne]: (request: GetOneDtoByIdRequestDto) =>
        this.execute({
          classType: GetOneDtoByIdRequestDto,
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
