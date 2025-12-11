import type { IncomingHttpHeaders } from 'http';

import { UserRole } from '@club-social/shared/users';
import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';

import type { AuthSession } from '@/infrastructure/auth/better-auth.types';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { CreateUserUseCase } from '@/application/users/create-user/create-user.use-case';
import { UpdateUserUseCase } from '@/application/users/update-user/update-user.use-case';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/domain/users/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '@/domain/users/user.repository';
import { BetterAuthService } from '@/infrastructure/auth/better-auth.service';

import { BaseController } from '../shared/controller';
import { ApiPaginatedResponse } from '../shared/decorators/api-paginated.decorator';
import { PaginatedDto } from '../shared/dto/paginated.dto';
import { ParamIdDto } from '../shared/dto/param-id.dto';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.dto';

@Controller('users')
export class UsersController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly betterAuthService: BetterAuthService,
  ) {
    super(logger);
  }

  @Patch(':id')
  public async update(
    @Param() request: ParamIdDto,
    @Body() body: UpdateUserRequestDto,
    @Headers() headers: IncomingHttpHeaders,
    @Session() session: AuthSession,
  ): Promise<void> {
    const user = this.handleResult(
      await this.updateUserUseCase.execute({
        email: body.email,
        firstName: body.firstName,
        id: request.id,
        lastName: body.lastName,
        status: body.status,
        updatedBy: session.user.name,
      }),
    );

    await this.betterAuthService.auth.api.adminUpdateUser({
      body: {
        data: {
          email: user.email.value,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          updatedBy: user.updatedBy,
        },
        userId: user.id.value,
      },
      headers: fromNodeHeaders(headers),
    });
  }

  @Post()
  public async create(
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const user = this.handleResult(
      await this.createUserUseCase.execute({
        createdBy: 'System',
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: UserRole.STAFF,
      }),
    );

    return this.toDto(user);
  }

  @ApiPaginatedResponse(UserResponseDto)
  @Get('paginated')
  public async getPaginated(): Promise<PaginatedDto<UserResponseDto>> {
    const users = await this.userRepository.findPaginated({
      page: 1,
      pageSize: 10,
    });

    return {
      data: users.data.map((user) => this.toDto(user)),
      total: users.total,
    };
  }

  @Get(':id')
  public async getById(
    @Param() request: ParamIdDto,
  ): Promise<null | UserResponseDto> {
    const user = await this.userRepository.findOneById(
      UniqueId.raw({ value: request.id }),
    );

    return user ? this.toDto(user) : null;
  }

  private toDto(user: UserEntity): UserResponseDto {
    return {
      email: user.email.value,
      firstName: user.firstName,
      id: user.id.value,
      lastName: user.lastName,
      name: user.name,
      role: user.role,
      status: user.status,
    };
  }
}
