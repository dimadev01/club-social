import { UserRole } from '@club-social/shared/users';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
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
import { ParamIdDto } from '@/shared/presentation/dto/param-id.dto';

import { CreateUserUseCase } from '../application/create-user/create-user.use-case';
import { UpdateUserUseCase } from '../application/update-user/update-user.use-case';
import { UserEntity } from '../domain/entities/user.entity';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from '../domain/user.repository';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.dto';

@Controller('users')
export class UsersController extends BaseController {
  private readonly pinoLogger: Logger = new Logger(UsersController.name);

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
    this.pinoLogger.log('Getting paginated users', {
      page: 1,
      pageSize: 10,
    });

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
