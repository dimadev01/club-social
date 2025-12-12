import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { ConfigTypes } from './config.schema';

@Injectable()
export class ConfigService {
  public readonly appDisplayName: string;
  public readonly betterStackEndpoint: string;
  public readonly betterStackSourceToken: string;
  public readonly databaseUrl: string;
  public readonly emailSmtpHost: string;
  public readonly emailSmtpPort: number;
  public readonly environment: ConfigTypes['ENVIRONMENT'];
  public readonly isDev: boolean;
  public readonly isLocal: boolean;
  public readonly isProd: boolean;
  public readonly nodeEnv: ConfigTypes['NODE_ENV'];
  public readonly port: number;
  public readonly resendApiKey: string;
  public readonly trustedOrigins: string[];

  public constructor(private readonly config: NestConfigService<ConfigTypes>) {
    this.nodeEnv = this.config.getOrThrow<ConfigTypes['NODE_ENV']>('NODE_ENV');
    this.environment =
      this.config.getOrThrow<ConfigTypes['ENVIRONMENT']>('ENVIRONMENT');

    this.isDev = this.environment === 'development';
    this.isLocal = this.environment === 'local';
    this.isProd = this.environment === 'production';

    this.appDisplayName = 'Club Social API';

    this.betterStackEndpoint = this.config.getOrThrow<string>(
      'BETTER_STACK_ENDPOINT',
    );
    this.betterStackSourceToken = this.config.getOrThrow<string>(
      'BETTER_STACK_SOURCE_TOKEN',
    );

    this.databaseUrl = this.config.getOrThrow<string>('DATABASE_URL');

    this.resendApiKey = this.config.getOrThrow<string>('RESEND_API_KEY');

    this.port = this.config.getOrThrow<number>('PORT');

    this.trustedOrigins = this.config.getOrThrow<string[]>(
      'BETTER_AUTH_TRUSTED_ORIGINS',
    );

    this.emailSmtpHost = this.config.getOrThrow<string>('EMAIL_SMTP_HOST');
    this.emailSmtpPort = this.config.getOrThrow<number>('EMAIL_SMTP_PORT');
  }
}
