import { UserRole } from '@club-social/shared/users';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';

import { type AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { PaginatedDto } from '@/shared/presentation/dto/paginated.dto';
import { IdDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateMemberUseCase } from '../application/create-member/create-member.use-case';
import { UpdateMemberUseCase } from '../application/update-member/update-member.use-case';
import { MemberEntity } from '../domain/entities/member.entity';
import {
  MEMBER_REPOSITORY_PROVIDER,
  type MemberRepository,
} from '../domain/member.repository';
import { CreateMemberRequestDto } from './dto/create-member.dto';
import { MemberResponseDto } from './dto/member.dto';
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
    @Param() request: IdDto,
    @Body() body: UpdateMemberRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.updateMemberUseCase.execute({
        email: body.email,
        firstName: body.firstName,
        id: request.id,
        lastName: body.lastName,
        status: body.status,
        updatedBy: session.user.name,
      }),
    );
  }

  @Post()
  public async create(
    @Body() createMemberDto: CreateMemberRequestDto,
    @Session() session: AuthSession,
  ): Promise<IdDto> {
    const { id } = this.handleResult(
      await this.createMemberUseCase.execute({
        createdBy: session.user.name,
        email: createMemberDto.email,
        firstName: createMemberDto.firstName,
        lastName: createMemberDto.lastName,
        role: UserRole.STAFF,
      }),
    );

    return { id: id.value };
  }

  @ApiPaginatedResponse(MemberResponseDto)
  @Get('paginated')
  public async getPaginated(): Promise<PaginatedDto<MemberResponseDto>> {
    const members = await this.memberRepository.findPaginated({
      page: 1,
      pageSize: 10,
    });

    return {
      data: members.data.map((member) => this.toDto(member)),
      total: members.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: IdDto,
  ): Promise<MemberResponseDto | null> {
    const member = await this.memberRepository.findOneById(
      UniqueId.raw({ value: request.id }),
    );

    return member ? this.toDto(member) : null;
  }

  private toDto(member: MemberEntity): MemberResponseDto {
    return {
      email: member.email.value,
      firstName: member.firstName,
      id: member.id.value,
      lastName: member.lastName,
      name: member.name,
      role: member.role,
      status: member.status,
    };
  }
}
