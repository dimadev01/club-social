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

import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateMemberUseCase } from '../application/create-member/create-member.use-case';
import { UpdateMemberUseCase } from '../application/update-member/update-member.use-case';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '../domain/member.repository';
import {
  MemberDetailModel,
  MemberListModel,
  MemberPaginatedModel,
} from '../domain/member.types';
import { CreateMemberRequestDto } from './dto/create-member.dto';
import { MemberDetailDto } from './dto/member-detail.dto';
import { MemberListDto } from './dto/member-list.dto';
import { MemberPaginatedDto } from './dto/member-paginated.dto';
import { UpdateMemberRequestDto } from './dto/update-member.dto';

@Controller('members')
export class MembersController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly updateMemberUseCase: UpdateMemberUseCase,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
  ) {
    super(logger);
  }

  @Patch(':id')
  public async update(
    @Param() request: ParamIdDto,
    @Body() body: UpdateMemberRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.updateMemberUseCase.execute({
        address: body.address
          ? Address.create({
              cityName: body.address.cityName,
              stateName: body.address.stateName,
              street: body.address.street,
              zipCode: body.address.zipCode,
            })
          : null,
        birthDate: body.birthDate ? body.birthDate : null,
        category: body.category,
        documentID: body.documentID,
        email: body.email,
        fileStatus: body.fileStatus,
        firstName: body.firstName,
        id: request.id,
        lastName: body.lastName,
        maritalStatus: body.maritalStatus,
        nationality: body.nationality,
        phones: body.phones,
        sex: body.sex,
        status: body.status,
        updatedBy: session.user.name,
      }),
    );
  }

  @Post()
  public async create(
    @Body() createMemberDto: CreateMemberRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdDto> {
    const { id } = this.handleResult(
      await this.createMemberUseCase.execute({
        address: createMemberDto.address
          ? Address.create({
              cityName: createMemberDto.address.cityName,
              stateName: createMemberDto.address.stateName,
              street: createMemberDto.address.street,
              zipCode: createMemberDto.address.zipCode,
            })
          : null,
        birthDate: createMemberDto.birthDate ? createMemberDto.birthDate : null,
        category: createMemberDto.category,
        createdBy: session.user.name,
        documentID: createMemberDto.documentID,
        email: createMemberDto.email,
        fileStatus: createMemberDto.fileStatus,
        firstName: createMemberDto.firstName,
        lastName: createMemberDto.lastName,
        maritalStatus: createMemberDto.maritalStatus,
        nationality: createMemberDto.nationality,
        phones: createMemberDto.phones,
        sex: createMemberDto.sex,
      }),
    );

    return { id: id.value };
  }

  @ApiPaginatedResponse(MemberDetailDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<MemberPaginatedDto>> {
    const data = await this.memberRepository.findPaginatedModel({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: data.data.map((member) => this.toPaginatedDto(member)),
      total: data.total,
    };
  }

  @Get()
  public async getAll(): Promise<MemberListDto[]> {
    const data = await this.memberRepository.findAll({ includeUser: true });

    return data.map(({ member, user }) => this.toListDto({ member, user }));
  }

  @Get(':id')
  public async getById(@Param() request: ParamIdDto): Promise<MemberDetailDto> {
    const model = await this.memberRepository.findOneModel(
      UniqueId.raw({ value: request.id }),
    );

    if (!model) {
      throw new NotFoundException('Member not found');
    }

    return this.toDetailDto(model);
  }

  private toListDto(model: MemberListModel): MemberListDto {
    return {
      id: model.member.id.value,
      name: model.user.name,
      status: model.user.status,
    };
  }

  private toDetailDto(model: MemberDetailModel): MemberDetailDto {
    return {
      address: model.member.address
        ? {
            cityName: model.member.address.cityName,
            stateName: model.member.address.stateName,
            street: model.member.address.street,
            zipCode: model.member.address.zipCode,
          }
        : null,
      birthDate: model.member.birthDate ? model.member.birthDate.value : null,
      category: model.member.category,
      documentID: model.member.documentID,
      dues: model.dues.map((due) => ({
        amount: due.amount.toCents(),
        category: due.category,
        date: due.date.value,
        id: due.id.value,
        notes: due.notes,
        status: due.status,
      })),
      email: model.user.email.value,
      fileStatus: model.member.fileStatus,
      firstName: model.user.firstName,
      id: model.member.id.value,
      lastName: model.user.lastName,
      maritalStatus: model.member.maritalStatus,
      name: model.user.name,
      nationality: model.member.nationality,
      phones: model.member.phones,
      sex: model.member.sex,
      status: model.user.status,
      userId: model.member.userId.value,
    };
  }

  private toPaginatedDto(model: MemberPaginatedModel): MemberPaginatedDto {
    return {
      category: model.member.category,
      email: model.user.email.value,
      id: model.member.id.value,
      name: model.user.name,
      status: model.user.status,
    };
  }
}
