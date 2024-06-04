import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { CreateMemberRequestDto } from '@adapters/dtos/create-member-request.dto';
import { GetMembersGridRequestDto } from '@adapters/dtos/get-members-grid-request.dto';
import { GetMembersRequestDto } from '@adapters/dtos/get-members-request.dto';
import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { UpdateMemberRequestDto } from '@adapters/dtos/update-member-request.dto';
import { MemberDtoMapper } from '@adapters/mappers/member-dto.mapper';
import { DIToken } from '@application/common/di/tokens.di';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { MemberDto } from '@application/members/dtos/member.dto';
import { CreateMemberUseCase } from '@application/members/use-cases/create-member/create-member.use-case';
import { GetMembersGridResponse } from '@application/members/use-cases/ger-members-grid/get-members-grid.response';
import { GetMembersGridUseCase } from '@application/members/use-cases/ger-members-grid/get-members-grid.use-case';
import { GetMemberRequest } from '@application/members/use-cases/get-member/get-member.request';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { GetMembersUseCase } from '@application/members/use-cases/get-members/get-members.use-case';
import { GetMembersExportResponse } from '@application/members/use-cases/get-members-export/get-members-export.response';
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
    private readonly _memberDtoMapper: MemberDtoMapper,
  ) {
    super(logger);
  }

  public async createOne(request: CreateMemberRequestDto): Promise<MemberDto> {
    const member = await this.execute({
      classType: CreateMemberRequestDto,
      request,
      useCase: this._create,
    });

    return this._memberDtoMapper.toDto(member);
  }

  public async get(request: GetMembersRequestDto): Promise<MemberDto[]> {
    const members = await this.execute({
      classType: GetMembersRequestDto,
      request,
      useCase: this._get,
    });

    return members.map((member) => this._memberDtoMapper.toDto(member));
  }

  public async getGrid(
    request: GetMembersGridRequestDto,
  ): Promise<GetMembersGridResponse<MemberGridDto>> {
    const { balances, items, totalCount, totals } = await this.execute({
      classType: GetMembersGridRequestDto,
      request,
      useCase: this._getGrid,
    });

    return {
      balances,
      items: items.map<MemberGridDto>((member) => {
        const balance = balances.find((b) => b._id === member._id);

        invariant(balance);

        return {
          category: member.category,
          id: member._id,
          name: member.name,
          pendingElectricity: balance.electricity,
          pendingGuest: balance.guest,
          pendingMembership: balance.membership,
          pendingTotal: balance.total,
          status: member.status,
        };
      }),
      totalCount,
      totals,
    };
  }

  public async getOne(request: GetMemberRequest): Promise<MemberDto | null> {
    const member = await this.execute({
      classType: GetOneDtoByIdRequestDto,
      request,
      useCase: this._getOne,
    });

    if (!member) {
      return null;
    }

    return this._memberDtoMapper.toDto(member);
  }

  public async getToExport(
    request: GetMembersGridRequestDto,
  ): Promise<GetMembersExportResponse<MemberGridDto>> {
    const { items, balances } = await this.execute({
      classType: GetMembersGridRequestDto,
      request,
      useCase: this._getToExport,
    });

    return {
      balances,
      items: items.map<MemberGridDto>((member) => {
        const balance = balances.find((b) => b._id === member._id);

        invariant(balance);

        return {
          category: member.category,
          id: member._id,
          name: member.name,
          pendingElectricity: balance.electricity,
          pendingGuest: balance.guest,
          pendingMembership: balance.membership,
          pendingTotal: balance.total,
          status: member.status,
        };
      }),
    };
  }

  public async update(request: UpdateMemberRequestDto): Promise<MemberDto> {
    const member = await this.execute({
      classType: UpdateMemberRequestDto,
      request,
      useCase: this._update,
    });

    return this._memberDtoMapper.toDto(member);
  }
}
