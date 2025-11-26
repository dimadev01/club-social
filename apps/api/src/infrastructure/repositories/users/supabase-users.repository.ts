import { Inject, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/application/shared/logger/logger';
import { UserEntity } from '@/domain/users/user.entity';
import { ConfigService } from '@/infrastructure/config/config.service';
import { Database } from '@/infrastructure/supabase/supabase.types';

@Injectable()
export class SupabaseUsersRepository {
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
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: entity.email.value,
      email_confirm: true,
      user_metadata: {
        first_name: entity.firstName,
        last_name: entity.lastName,
      },
    });

    if (error) {
      throw error;
    }

    this.logger.info({
      data,
      message: 'User created',
    });

    return entity;
  }
}
