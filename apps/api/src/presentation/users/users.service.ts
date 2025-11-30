import { Inject, Injectable } from '@nestjs/common';
import { User } from '@supabase/supabase-js';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { err, ok, Result } from '@/domain/shared/result';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UserEntity } from '@/domain/users/user.entity';
import { SupabaseRepository } from '@/infrastructure/supabase/supabase.repository';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly supabaseRepository: SupabaseRepository,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Result<UserEntity>> {
    const email = Email.create(createUserDto.email);

    if (email.isErr()) {
      return err(email.error);
    }

    let supabaseUser: User;

    try {
      supabaseUser = await this.supabaseRepository.createUser({
        email: createUserDto.email,
      });
    } catch (error) {
      return err(error);
    }

    const user = UserEntity.create({
      authId: supabaseUser.id,
      email: email.value,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });

    if (user.isErr()) {
      return err(user.error);
    }

    return ok(user.value);
  }
}
