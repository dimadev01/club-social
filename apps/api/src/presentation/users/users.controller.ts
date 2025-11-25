import { Controller, Get, Inject } from '@nestjs/common';

import { PaginatedResponse } from '@/domain/shared/types';
import { UserEntity } from '@/domain/users/user.entity';
import {
  type UserRepository,
  USERS_REPOSITORY_PROVIDER,
} from '@/domain/users/user.repository';

import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  public constructor(
    @Inject(USERS_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {}

  @Get('paginated')
  public async getPaginated(): Promise<PaginatedResponse<UserDto>> {
    const users = await this.userRepository.findPaginated({
      page: 1,
      pageSize: 10,
    });

    return {
      data: users.data.map((user) => this.toDto(user)),
      meta: users.meta,
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
