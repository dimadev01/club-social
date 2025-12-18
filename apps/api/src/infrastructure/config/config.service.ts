import { Configuration, Value } from '@itgorillaz/configify';
import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

@Configuration()
export class ConfigService {
  @IsEmail()
  @Value('ADMIN_USER_EMAIL')
  public readonly adminUserEmail: string;

  @IsNotEmpty()
  @Value('APP_DISPLAY_NAME')
  public readonly appDisplayName: string;

  @IsUrl()
  @Value('BETTER_STACK_ENDPOINT')
  public readonly betterStackEndpoint: string;

  @IsNotEmpty()
  @Value('BETTER_STACK_SOURCE_TOKEN')
  public readonly betterStackSourceToken: string;

  @IsNotEmpty()
  @Value('DATABASE_URI')
  public readonly databaseUrl: string;

  @IsNotEmpty()
  @Value('EMAIL_SMTP_HOST')
  public readonly emailSmtpHost: string;

  @IsNotEmpty()
  @Value('EMAIL_SMTP_PORT', { parse: Number })
  public readonly emailSmtpPort: number;

  @IsNotEmpty()
  @Value('ENVIRONMENT')
  public readonly environment: string;

  @IsNotEmpty()
  @Value('NODE_ENV')
  public readonly nodeEnv: string;

  @IsNotEmpty()
  @Value('PORT', { parse: Number })
  public readonly port: number;

  @IsNotEmpty()
  @Value('REDIS_HOST')
  public readonly redisHost: string;

  @IsNotEmpty()
  @Value('REDIS_PORT', { parse: Number })
  public readonly redisPort: number;

  @IsNotEmpty()
  @Value('RESEND_API_KEY')
  public readonly resendApiKey: string;

  @IsNotEmpty()
  @Value('BETTER_AUTH_TRUSTED_ORIGINS', { parse: (value) => value.split(',') })
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
