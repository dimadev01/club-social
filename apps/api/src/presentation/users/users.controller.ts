import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
} from '@nestjs/common';

import { CreateUserUseCase } from '@/application/users/create-user/create-user.use-case';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UserEntity } from '@/domain/users/user.entity';
import {
  type UserRepository,
  USERS_REPOSITORY_PROVIDER,
} from '@/domain/users/user.repository';

import { BaseController } from '../shared/controller';
import { ApiPaginatedResponse } from '../shared/decorators/api-paginated.decorator';
import { PaginatedDto } from '../shared/dto/paginated.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController extends BaseController {
  public constructor(
    @Inject(USERS_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {
    super();
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const email = Email.create(createUserDto.email);

    if (email.isErr()) {
      throw new BadRequestException(email.error.message);
    }

    const user = this.handleResult(
      await this.createUserUseCase.execute({
        email: email.value,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      }),
    );

    return this.toDto(user);
  }

  @ApiPaginatedResponse(UserDto)
  @Get('paginated')
  public async getPaginated(): Promise<PaginatedDto<UserDto>> {
    const users = await this.userRepository.findPaginated({
      page: 1,
      pageSize: 10,
    });

    return {
      data: users.data.map((user) => this.toDto(user)),
      total: users.total,
    };
  }

  private toDto(user: UserEntity): UserDto {
    return {
      email: user.email.value,
      firstName: user.firstName,
      id: user.id.value,
      lastName: user.lastName,
    };
  }
}
