import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Configuration()
export class ConfigService {
  @IsNotEmpty()
  @Value('APP_DISPLAY_NAME')
  public readonly appDisplayName: string;

  @IsString()
  @Value('APP_DOMAIN')
  public readonly appDomain: string;

  @IsString()
  @Value('DATABASE_URI')
  public readonly databaseUrl: string;

  @IsString()
  @Value('EMAIL_SMTP_HOST', { default: 'localhost' })
  public readonly emailSmtpHost: string;

  @IsNumber()
  @Value('EMAIL_SMTP_PORT', { default: 1025, parse: Number })
  public readonly emailSmtpPort: number;

  @IsString()
  @Value('ENVIRONMENT')
  public readonly environment: string;

  @IsString()
  @Value('MONGO_URI')
  public readonly mongoUri: string;

  @IsString()
  @Value('NODE_ENV')
  public readonly nodeEnv: string;

  @IsNumber()
  @Value('PORT', { parse: Number })
  public readonly port: number;

  @IsString()
  @Value('REDIS_HOST')
  public readonly redisHost: string;

  @IsString()
  @Value('REDIS_PASSWORD', { default: '' })
  public readonly redisPassword: string;

  @IsNumber()
  @Value('REDIS_PORT', { parse: Number })
  public readonly redisPort: number;

  @IsString()
  @Value('RESEND_API_KEY')
  public readonly resendApiKey: string;

  @IsString({ each: true })
  @Value('TRUSTED_ORIGINS', {
    parse: (value) => value?.split(',') ?? [],
  })
  public readonly trustedOrigins: string[];

  public get isDev(): boolean {
    return this.environment === 'development';
  }

  public get isLocal(): boolean {
    return this.environment === 'local';
  }

  public get isProd(): boolean {
    return this.environment === 'production';
  }
}
