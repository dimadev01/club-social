import type { Response } from 'express';

import { MemberCategoryLabel } from '@club-social/shared/members';
import { UserStatusLabel } from '@club-social/shared/users';
import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common';

import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import { CsvService } from '@/infrastructure/csv/csv.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { ExportRequestDto } from '@/shared/presentation/dto/export-request.dto';
import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateMemberUseCase } from '../application/create-member/create-member.use-case';
import { UpdateMemberUseCase } from '../application/update-member/update-member.use-case';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '../domain/member.repository';
import { CreateMemberRequestDto } from './dto/create-member.dto';
import { MemberDetailDto } from './dto/member-detail.dto';
import { MemberPaginatedDto } from './dto/member-paginated.dto';
import { MemberSearchRequestDto } from './dto/member-search-request.dto';
import { MemberSearchDto } from './dto/member-search.dto';
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
    private readonly csvService: CsvService,
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

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  public async export(
    @Query() query: ExportRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.memberRepository.findForExport({
      filters: query.filters,
      sort: query.sort,
    });

    const stream = this.csvService.generateStream(data, [
      { accessor: (row) => row.member.id.value, header: 'ID' },
      { accessor: (row) => row.user.name, header: 'Nombre' },
      {
        accessor: (row) => MemberCategoryLabel[row.member.category],
        header: 'Categoría',
      },
      {
        accessor: (row) => UserStatusLabel[row.user.status],
        header: 'Estado',
      },
      { accessor: (row) => row.user.email.value, header: 'Email' },
    ]);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${query.filename}"`,
    );

    stream.pipe(res);
  }

  @ApiPaginatedResponse(MemberDetailDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<MemberPaginatedDto>> {
    const data = await this.memberRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: data.data.map((item) => ({
        category: item.member.category,
        email: item.user.email.value,
        id: item.member.id.value,
        name: item.user.name,
        userStatus: item.user.status,
      })),
      total: data.total,
    };
  }

  @Get()
  public async getAll(): Promise<MemberPaginatedDto[]> {
    const data = await this.memberRepository.findAll({ includeUser: true });

    return data.map(({ member, user }) => ({
      category: member.category,
      email: user.email.value,
      id: member.id.value,
      name: user.name,
      userStatus: user.status,
    }));
  }

  @Get('search')
  public async search(
    @Query() query: MemberSearchRequestDto,
  ): Promise<MemberSearchDto[]> {
    const data = await this.memberRepository.search({
      limit: query.limit ?? 20,
      searchTerm: query.q,
    });

    return data.map(({ member, user }) => ({
      email: user.email.value,
      id: member.id.value,
      name: user.name,
      status: user.status,
    }));
  }

  @Get(':id')
  public async getById(@Param() request: ParamIdDto): Promise<MemberDetailDto> {
    const model = await this.memberRepository.findOneModel(
      UniqueId.raw({ value: request.id }),
    );

    if (!model) {
      throw new NotFoundException('Member not found');
    }

    const { dues, member, user } = model;

    return {
      address: member.address
        ? {
            cityName: member.address.cityName,
            stateName: member.address.stateName,
            street: member.address.street,
            zipCode: member.address.zipCode,
          }
        : null,
      birthDate: member.birthDate ? member.birthDate.value : null,
      category: member.category,
      documentID: member.documentID,
      dues: dues.map((due) => ({
        amount: due.amount.toCents(),
        category: due.category,
        date: due.date.value,
        id: due.id.value,
        notes: due.notes,
        status: due.status,
      })),
      email: user.email.value,
      fileStatus: member.fileStatus,
      firstName: user.firstName,
      id: member.id.value,
      lastName: user.lastName,
      maritalStatus: member.maritalStatus,
      name: user.name,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: user.status,
      userId: member.userId.value,
    };
  }
}
