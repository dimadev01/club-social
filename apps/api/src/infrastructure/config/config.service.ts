import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsUrl } from 'class-validator';

// @Injectable()
@Configuration()
export class ConfigService {
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
  @Value('DATABASE_URL')
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

  // public constructor(private readonly config: NestConfigService<ConfigTypes>) {
  //   this.nodeEnv = this.config.getOrThrow<ConfigTypes['NODE_ENV']>('NODE_ENV');
  //   this.environment =
  //     this.config.getOrThrow<ConfigTypes['ENVIRONMENT']>('ENVIRONMENT');

  //   this.isDev = this.environment === 'development';
  //   this.isLocal = this.environment === 'local';
  //   this.isProd = this.environment === 'production';

  //   this.appDisplayName = 'Club Social API';

  //   this.betterStackEndpoint = this.config.getOrThrow<string>(
  //     'BETTER_STACK_ENDPOINT',
  //   );
  //   this.betterStackSourceToken = this.config.getOrThrow<string>(
  //     'BETTER_STACK_SOURCE_TOKEN',
  //   );

  //   this.databaseUrl = this.config.getOrThrow<string>('DATABASE_URL');

  //   this.resendApiKey = this.config.getOrThrow<string>('RESEND_API_KEY');

  //   this.port = this.config.getOrThrow<number>('PORT');

  //   this.trustedOrigins = this.config.getOrThrow<string[]>(
  //     'BETTER_AUTH_TRUSTED_ORIGINS',
  //   );

  //   this.emailSmtpHost = this.config.getOrThrow<string>('EMAIL_SMTP_HOST');
  //   this.emailSmtpPort = this.config.getOrThrow<number>('EMAIL_SMTP_PORT');

  //   this.redisHost = this.config.getOrThrow<string>('REDIS_HOST');
  //   this.redisPort = this.config.getOrThrow<number>('REDIS_PORT');
  // }
}
