import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { CreateUserUseCase } from '@/application/users/create-user/create-user.use-case';
import { ConflictError } from '@/domain/shared/errors/conflict.error';
import { err, ok, Result } from '@/domain/shared/result';
import { PaginatedResponse } from '@/domain/shared/types';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UserEntity } from '@/domain/users/user.entity';
import { UserRole } from '@/domain/users/user.enum';
import {
  type UserRepository,
  USERS_REPOSITORY_PROVIDER,
} from '@/domain/users/user.repository';
import { SupabaseRepository } from '@/infrastructure/supabase/supabase.repository';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly supabaseRepository: SupabaseRepository,
    @Inject(USERS_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Result<UserEntity>> {
    const email = Email.create(createUserDto.email);

    if (email.isErr()) {
      return err(email.error);
    }

    const existingUser = await this.userRepository.findUniqueByEmail(
      email.value,
    );

    if (existingUser) {
      return err(new ConflictError('User with this email already exists'));
    }

    let supabaseUser: User;

    try {
      supabaseUser = await this.supabaseRepository.createUser({
        email: createUserDto.email,
      });
    } catch (error) {
      return err(error);
    }

    const createUserUseCaseResult = await this.createUserUseCase.execute({
      authId: supabaseUser.id,
      email: email.value,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: UserRole.STAFF,
    });

    if (createUserUseCaseResult.isErr()) {
      try {
        await this.supabaseRepository.deleteUser({ id: supabaseUser.id });
      } catch (error) {
        this.logger.error({
          error,
          message: 'Error deleting user from supabase',
          params: { id: supabaseUser.id },
        });

        throw new InternalServerErrorException();
      }

      return err(createUserUseCaseResult.error);
    }

    return ok(createUserUseCaseResult.value);
  }

  public async getPaginated(): Promise<PaginatedResponse<UserEntity>> {
    return this.userRepository.findPaginated({
      page: 1,
      pageSize: 10,
    });
  }
}
