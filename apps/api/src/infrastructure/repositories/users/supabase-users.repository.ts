import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { EntityNotFoundError } from '@/domain/shared/errors/entity-not-found.error';
import {
  PaginatedRequestParams,
  PaginatedResponse,
} from '@/domain/shared/types';
import { Email } from '@/domain/shared/value-objects/email/email.vo';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';
import { UserEntity } from '@/domain/users/user.entity';
import { UserInterface } from '@/domain/users/user.interface';
import { UserRepository } from '@/domain/users/user.repository';
import { ConfigService } from '@/infrastructure/config/config.service';

import { SupabaseUserMapper } from './supabase-user.mapper';

@Injectable()
export class SupabaseUsersRepository implements UserRepository {
  private readonly supabase: SupabaseClient;

  public constructor(private readonly configService: ConfigService) {
    const client = createClient(
      this.configService.supabaseUrl,
      this.configService.supabaseKey,
    );

    this.supabase = client;
  }

  public async delete(entity: UserEntity): Promise<void> {
    await this.supabase.from('users').delete().eq('id', entity.id.value);
  }

  public async findOneById(id: UniqueId): Promise<null | UserEntity> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id.value)
      .single<null | UserInterface>();

    if (error) {
      throw error;
    }

    return user ? SupabaseUserMapper.toDomain(user) : null;
  }

  public async findOneByIdOrThrow(id: UniqueId): Promise<UserEntity> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id.value)
      .single<null | UserInterface>();

    if (error) {
      throw error;
    }

    if (!user) {
      throw new EntityNotFoundError(UserEntity, id.value);
    }

    return SupabaseUserMapper.toDomain(user);
  }

  public async findPaginated(
    params: PaginatedRequestParams,
  ): Promise<PaginatedResponse<UserEntity>> {
    console.log('findPaginated', params);

    return Promise.resolve({
      data: [],
      total: 0,
    });
  }

  public async findUniqueByEmail(email: Email): Promise<null | UserEntity> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email.value)
      .single<null | UserInterface>();

    if (error) {
      throw error;
    }

    return user ? SupabaseUserMapper.toDomain(user) : null;
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    const { error } = await this.supabase
      .from('users')
      .upsert(SupabaseUserMapper.toPersistence(entity), {
        onConflict: 'id',
      });

    if (error) {
      throw error;
    }

    return entity;
  }
}
