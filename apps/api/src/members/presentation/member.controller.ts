import type { Response } from 'express';

import { NumberFormat } from '@club-social/shared/lib';
import {
  MemberCategoryLabel,
  MemberStatusLabel,
} from '@club-social/shared/members';
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
import { ExportDataRequestDto } from '@/shared/presentation/dto/export-request.dto';
import { GetPaginatedDataRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedDataResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdReqResDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateMemberUseCase } from '../application/create-member/create-member.use-case';
import { UpdateMemberUseCase } from '../application/update-member/update-member.use-case';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '../domain/member.repository';
import { CreateMemberRequestDto } from './dto/create-member.dto';
import {
  MemberPaginatedExtraResponseDto,
  MemberPaginatedResponseDto,
} from './dto/member-paginated.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { MemberSearchRequestDto } from './dto/member-search-request.dto';
import { MemberSearchResponseDto } from './dto/member-search.dto';
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
    @Param() request: ParamIdReqResDto,
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
  ): Promise<ParamIdReqResDto> {
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
    @Query() query: ExportDataRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.memberRepository.findForExport({
      filters: query.filters,
      sort: query.sort,
    });

    const stream = this.csvService.generateStream(data, [
      { accessor: (row) => row.id, header: 'ID' },
      { accessor: (row) => row.name, header: 'Nombre' },
      {
        accessor: (row) => MemberCategoryLabel[row.category],
        header: 'Categoría',
      },
      {
        accessor: (row) => MemberStatusLabel[row.status],
        header: 'Estado',
      },
      { accessor: (row) => row.email, header: 'Email' },
      {
        accessor: (row) => NumberFormat.fromCents(row.memberShipTotalDueAmount),
        header: 'Deuda cuota',
      },
      {
        accessor: (row) =>
          NumberFormat.fromCents(row.electricityTotalDueAmount),
        header: 'Deuda luz',
      },
      {
        accessor: (row) => NumberFormat.fromCents(row.guestTotalDueAmount),
        header: 'Deuda invitado',
      },
    ]);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${query.filename}"`,
    );

    stream.pipe(res);
  }

  @ApiPaginatedResponse(MemberResponseDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
  ): Promise<
    PaginatedDataResponseDto<
      MemberPaginatedResponseDto,
      MemberPaginatedExtraResponseDto
    >
  > {
    const data = await this.memberRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: data.data.map((member) => ({
        category: member.category,
        electricityTotalDueAmount: member.electricityTotalDueAmount,
        email: member.email,
        guestTotalDueAmount: member.guestTotalDueAmount,
        id: member.id,
        memberShipTotalDueAmount: member.memberShipTotalDueAmount,
        name: member.name,

        status: member.status,
      })),
      extra: data.extra ?? {
        electricityTotalDueAmount: 0,
        guestTotalDueAmount: 0,
        memberShipTotalDueAmount: 0,
      },
      total: data.total,
    };
  }

  @Get('search')
  public async search(
    @Query() query: MemberSearchRequestDto,
  ): Promise<MemberSearchResponseDto[]> {
    return this.memberRepository.search({
      limit: query.limit ?? 20,
      searchTerm: query.q,
    });
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdReqResDto,
  ): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findByIdReadModel(
      UniqueId.raw({ value: request.id }),
    );

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return {
      address: member.address,
      birthDate: member.birthDate,
      category: member.category,
      documentID: member.documentID,
      email: member.email,
      fileStatus: member.fileStatus,
      firstName: member.firstName,
      id: member.id,
      lastName: member.lastName,
      maritalStatus: member.maritalStatus,
      name: member.name,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: member.status,
      userId: member.userId,
    };
  }
}
