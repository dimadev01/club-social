import { Inject, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { ConfigService } from '@/infrastructure/config/config.service';
import { Database } from '@/infrastructure/supabase/supabase.types';

import {
  CreateSupabaseUserParams,
  DeleteSupabaseUserParams,
} from './supabase-repository.types';

@Injectable()
export class SupabaseRepository {
  private readonly supabase: SupabaseClient<Database>;

  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
  ) {
    this.supabase = createClient<Database>(
      this.configService.supabaseUrl,
      this.configService.supabaseKey,
    );
    this.logger.setContext(this.constructor.name);
  }

  public async createUser(params: CreateSupabaseUserParams): Promise<User> {
    this.logger.info({
      message: 'Creating user',
      params,
    });

    const { data, error } = await this.supabase.auth.admin.createUser({
      email: params.email,
      email_confirm: true,
    });

    if (error) {
      this.logger.error({
        error,
        message: 'Error creating user',
        params,
      });
      throw error;
    }

    return data.user;
  }

  public async deleteUser(params: DeleteSupabaseUserParams): Promise<void> {
    this.logger.info({
      message: 'Deleting user',
      params,
    });

    const { error } = await this.supabase.auth.admin.deleteUser(params.id);

    if (error) {
      this.logger.error({
        error,
        message: 'Error deleting user',
        params,
      });
      throw error;
    }
  }
}
