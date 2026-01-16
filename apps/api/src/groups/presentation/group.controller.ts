import { AppSettingKey } from '@club-social/shared/app-settings';
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';

import { AppSettingService } from '@/app-settings/infrastructure/app-setting.service';
import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { GetPaginatedDataRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedDataResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdReqResDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateGroupUseCase } from '../application/create-group.use-case';
import { UpdateGroupUseCase } from '../application/update-group.use-case';
import {
  GROUP_REPOSITORY_PROVIDER,
  type GroupRepository,
} from '../domain/group.repository';
import { CreateGroupRequestDto } from './dto/create-group.dto';
import { GroupPaginatedResponseDto } from './dto/group-paginated.dto';
import { GroupResponseDto } from './dto/group-response.dto';
import { UpdateGroupRequestDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    @Inject(GROUP_REPOSITORY_PROVIDER)
    private readonly groupRepository: GroupRepository,
    private readonly appSettingService: AppSettingService,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() body: CreateGroupRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdReqResDto> {
    const { id } = this.handleResult(
      await this.createGroupUseCase.execute({
        createdBy: session.user.name,
        memberIds: body.memberIds,
        name: body.name,
      }),
    );

    return { id: id.value };
  }

  @Patch(':id')
  public async update(
    @Param() request: ParamIdReqResDto,
    @Body() body: UpdateGroupRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.updateGroupUseCase.execute({
        id: request.id,
        memberIds: body.memberIds,
        name: body.name,
        updatedBy: session.user.name,
      }),
    );
  }

  @ApiPaginatedResponse(GroupPaginatedResponseDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
    @Session() session: AuthSession,
  ): Promise<PaginatedDataResponseDto<GroupPaginatedResponseDto>> {
    const data = await this.groupRepository.findPaginated(
      {
        filters: query.filters,
        page: query.page,
        pageSize: query.pageSize,
        sort: query.sort,
      },
      this.buildQueryContext(session),
    );

    const groupDiscountTiers = await this.appSettingService.getValue(
      AppSettingKey.GROUP_DISCOUNT_TIERS,
    );

    return {
      data: data.data.map((group) => ({
        discountPercentage:
          groupDiscountTiers.value.find(
            (tier) =>
              group.members.length >= tier.minSize &&
              group.members.length <= tier.maxSize,
          )?.percent ?? 0,
        id: group.id,
        members: group.members.map((member) => ({
          id: member.id,
          name: member.name,
        })),
        name: group.name,
      })),
      total: data.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdReqResDto,
  ): Promise<GroupResponseDto> {
    const group = await this.groupRepository.findByIdReadModel(
      UniqueId.raw({ value: request.id }),
    );

    if (!group) {
      throw new NotFoundException();
    }

    return {
      createdAt: group.createdAt.toISOString(),
      createdBy: group.createdBy,
      id: group.id,
      members: group.members.map((member) => ({
        category: member.category,
        id: member.id,
        name: member.name,
        status: member.status,
      })),
      name: group.name,
      updatedAt: group.updatedAt.toISOString(),
      updatedBy: group.updatedBy,
    };
  }
}
