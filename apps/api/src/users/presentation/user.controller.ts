import { UserRole } from '@club-social/shared/users';
import {
  Body,
  Controller,
  ForbiddenException,
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
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { GetPaginatedDataRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedDataResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdReqResDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateUserUseCase } from '../application/create-user.use-case';
import { UpdateUserPreferencesUseCase } from '../application/update-user-preferences.use-case';
import { UpdateUserUseCase } from '../application/update-user.use-case';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '../domain/user.repository';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { UserPaginatedResponseDto } from './dto/user-paginated.dto';
import {
  UpdateUserPreferencesRequestDto,
  UserPreferencesResponseDto,
} from './dto/user-preferences.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserPreferencesUseCase: UpdateUserPreferencesUseCase,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() createUserDto: CreateUserRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdReqResDto> {
    const { id } = this.handleResult(
      await this.createUserUseCase.execute({
        createdBy: session.user.name,
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: UserRole.STAFF,
      }),
    );

    return { id: id.value };
  }

  @Patch(':id')
  public async update(
    @Param() request: ParamIdReqResDto,
    @Body() body: UpdateUserRequestDto,
    @Session() session: AuthSession,
  ): Promise<void> {
    this.handleResult(
      await this.updateUserUseCase.execute({
        email: body.email,
        firstName: body.firstName,
        id: request.id,
        lastName: body.lastName,
        status: body.status,
        updatedBy: session.user.name,
      }),
    );
  }

  @ApiPaginatedResponse(UserPaginatedResponseDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: GetPaginatedDataRequestDto,
  ): Promise<PaginatedDataResponseDto<UserPaginatedResponseDto>> {
    const users = await this.userRepository.findPaginated({
      filters: query.filters,
      page: query.page,
      pageSize: query.pageSize,
      sort: query.sort,
    });

    return {
      data: users.data.map((user) => ({
        email: user.email.value,
        id: user.id.value,
        name: user.name.fullName,
        role: user.role,
        status: user.status,
      })),
      total: users.total,
    };
  }

  @Get('me/preferences')
  public async getMyPreferences(
    @Session() session: AuthSession,
  ): Promise<UserPreferencesResponseDto> {
    const user = await this.userRepository.findByIdOrThrow(
      UniqueId.raw({ value: session.user.id }),
    );

    return user.preferences.toJSON();
  }

  @Patch('me/preferences')
  public async updateMyPreferences(
    @Body() body: UpdateUserPreferencesRequestDto,
    @Session() session: AuthSession,
  ): Promise<UserPreferencesResponseDto> {
    const user = this.handleResult(
      await this.updateUserPreferencesUseCase.execute({
        preferences: body,
        updatedBy: session.user.id,
        userId: session.user.id,
      }),
    );

    return user.preferences.toJSON();
  }

  @Get(':id/preferences')
  public async getUserPreferences(
    @Param() request: ParamIdReqResDto,
    @Session() session: AuthSession,
  ): Promise<UserPreferencesResponseDto> {
    this.requireAdmin(session);

    const user = await this.userRepository.findById(
      UniqueId.raw({ value: request.id }),
    );

    if (!user) {
      throw new NotFoundException();
    }

    return user.preferences.toJSON();
  }

  @Patch(':id/preferences')
  public async updateUserPreferences(
    @Param() request: ParamIdReqResDto,
    @Body() body: UpdateUserPreferencesRequestDto,
    @Session() session: AuthSession,
  ): Promise<UserPreferencesResponseDto> {
    this.requireAdmin(session);

    const user = this.handleResult(
      await this.updateUserPreferencesUseCase.execute({
        preferences: body,
        updatedBy: session.user.id,
        userId: request.id,
      }),
    );

    return user.preferences.toJSON();
  }

  @Get(':id')
  public async get(
    @Param() request: ParamIdReqResDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(
      UniqueId.raw({ value: request.id }),
    );

    if (!user) {
      throw new NotFoundException();
    }

    return {
      email: user.email.value,
      firstName: user.name.firstName,
      id: user.id.value,
      lastName: user.name.lastName,
      name: user.name.fullName,
      role: user.role,
      status: user.status,
    };
  }

  private requireAdmin(session: AuthSession): void {
    if (session.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }
  }
}
