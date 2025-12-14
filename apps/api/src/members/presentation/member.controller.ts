import {
  Body,
  Controller,
  Get,
  Inject,
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
import { Guard } from '@/shared/domain/guards';
import { Address } from '@/shared/domain/value-objects/address/address.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';
import { UserEntity } from '@/users/domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/users/domain/user.repository';

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
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
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
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
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
        birthDate: createMemberDto.birthDate
          ? new Date(createMemberDto.birthDate)
          : null,
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

  @ApiPaginatedResponse(MemberResponseDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<MemberResponseDto>> {
    const members = await this.memberRepository.findPaginated({
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    const users = await this.userRepository.findManyByIds(
      members.data.map((m) => m.userId),
    );

    return {
      data: members.data.map((member) => {
        const user = users.find((u) => u.id.equals(member.userId));
        Guard.defined(user);

        return this.toDto(member, user);
      }),
      total: members.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdDto,
  ): Promise<MemberResponseDto | null> {
    const member = await this.memberRepository.findOneById(
      UniqueId.raw({ value: request.id }),
    );

    if (!member) {
      return null;
    }

    const user = await this.userRepository.findOneByIdOrThrow(member.userId);

    return this.toDto(member, user);
  }

  private toDto(member: MemberEntity, user: UserEntity): MemberResponseDto {
    return {
      address: member.address
        ? {
            cityName: member.address.cityName,
            stateName: member.address.stateName,
            street: member.address.street,
            zipCode: member.address.zipCode,
          }
        : null,
      birthDate: member.birthDate ? member.birthDate.toISOString() : null,
      category: member.category,
      documentID: member.documentID,
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
