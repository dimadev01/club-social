import { Configuration, Value } from '@itgorillaz/configify';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

@Configuration()
export class ConfigService {
  @IsEmail()
  @Value('ADMIN_USER_EMAIL')
  public readonly adminUserEmail: string;

  @IsNotEmpty()
  @Value('APP_DISPLAY_NAME')
  public readonly appDisplayName: string;

  @IsString()
  @Value('APP_DOMAIN')
  public readonly appDomain: string;

  @IsUrl()
  @Value('BETTER_STACK_ENDPOINT')
  public readonly betterStackEndpoint: string;

  @IsString()
  @Value('BETTER_STACK_SOURCE_TOKEN')
  public readonly betterStackSourceToken: string;

  @IsString()
  @Value('DATABASE_URI')
  public readonly databaseUrl: string;

  @IsString()
  @Value('EMAIL_SMTP_HOST')
  public readonly emailSmtpHost: string;

  @IsNumber()
  @Value('EMAIL_SMTP_PORT', { parse: Number })
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

  @IsNumber()
  @Value('REDIS_PORT', { parse: Number })
  public readonly redisPort: number;

  @IsString()
  @Value('RESEND_API_KEY')
  public readonly resendApiKey: string;

  @IsString({ each: true })
  @Value('BETTER_AUTH_TRUSTED_ORIGINS', { parse: (value) => value.split(',') })
  public readonly trustedOrigins: string[];

  @IsString()
  @Value('UNLEASH_API_TOKEN')
  public readonly unleashApiToken: string;

  @IsString()
  @Value('UNLEASH_APP_NAME')
  public readonly unleashAppName: string;

  @IsString()
  @Value('UNLEASH_URL')
  public readonly unleashUrl: string;

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
