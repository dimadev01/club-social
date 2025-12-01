import { Body, Controller, Get, Inject, Post } from '@nestjs/common';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { UserEntity } from '@/domain/users/user.entity';

import { BaseController } from '../shared/controller';
import { ApiPaginatedResponse } from '../shared/decorators/api-paginated.decorator';
import { PaginatedDto } from '../shared/dto/paginated.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController extends BaseController {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    private readonly usersService: UsersService,
  ) {
    super(logger);
  }

  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = this.handleResult(
      await this.usersService.createUser(createUserDto),
    );

    return this.toDto(user);
  }

  @ApiPaginatedResponse(UserResponseDto)
  @Get('paginated')
  public async getPaginated(): Promise<PaginatedDto<UserResponseDto>> {
    const users = await this.usersService.getPaginated();

    return {
      data: users.data.map((user) => this.toDto(user)),
      total: users.total,
    };
  }

  private toDto(user: UserEntity): UserResponseDto {
    return {
      email: user.email.value,
      firstName: user.firstName,
      id: user.id.value,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
