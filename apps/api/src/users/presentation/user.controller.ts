import { UserRole } from '@club-social/shared/users';
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
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { BaseController } from '@/shared/presentation/controller';
import { ApiPaginatedResponse } from '@/shared/presentation/decorators/api-paginated.decorator';
import { PaginatedRequestDto } from '@/shared/presentation/dto/paginated-request.dto';
import { PaginatedResponseDto } from '@/shared/presentation/dto/paginated-response.dto';
import { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateUserUseCase } from '../application/create-user/create-user.use-case';
import { UpdateUserUseCase } from '../application/update-user/update-user.use-case';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '../domain/user.repository';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { UserDetailDto } from './dto/user-detail.dto';
import { UserPaginatedDto } from './dto/user-paginated.dto';

@Controller('users')
export class UsersController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {
    super(logger);
  }

  @Patch(':id')
  public async update(
    @Param() request: ParamIdDto,
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

  @Post()
  public async create(
    @Body() createUserDto: CreateUserRequestDto,
    @Session() session: AuthSession,
  ): Promise<ParamIdDto> {
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

  @ApiPaginatedResponse(UserPaginatedDto)
  @Get('paginated')
  public async getPaginated(
    @Query() query: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<UserPaginatedDto>> {
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
        name: user.name,
        role: user.role,
        status: user.status,
      })),
      total: users.total,
    };
  }

  @Get(':id')
  public async get(@Param() request: ParamIdDto): Promise<UserDetailDto> {
    const user = await this.userRepository.findOneById(
      UniqueId.raw({ value: request.id }),
    );

    if (!user) {
      throw new NotFoundException();
    }

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
