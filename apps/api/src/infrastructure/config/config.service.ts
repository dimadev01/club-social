import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { ConfigTypes } from './config.schema';

@Injectable()
export class ConfigService {
  public readonly appDisplayName: string;
  public readonly appName: string;
  public readonly betterStackEndpoint: string;
  public readonly betterStackSourceToken: string;
  public readonly databaseUrl: string;
  public readonly environment: ConfigTypes['ENVIRONMENT'];
  public readonly isDev: boolean;
  public readonly isLocal: boolean;
  public readonly isProd: boolean;
  public readonly nodeEnv: ConfigTypes['NODE_ENV'];
  public readonly port: number;

  public constructor(private readonly config: NestConfigService<ConfigTypes>) {
    this.environment =
      this.config.getOrThrow<ConfigTypes['ENVIRONMENT']>('ENVIRONMENT');
    this.isDev = this.environment === 'development';
    this.isLocal = this.environment === 'local';
    this.isProd = this.environment === 'production';
    this.databaseUrl = this.config.getOrThrow<string>('DATABASE_URL');
    this.nodeEnv = this.config.getOrThrow<ConfigTypes['NODE_ENV']>('NODE_ENV');
    this.port = this.config.getOrThrow<number>('PORT');
  }
}
