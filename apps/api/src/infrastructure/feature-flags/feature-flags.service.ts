import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { initialize, type Unleash } from 'unleash-client';

import { ConfigService } from '@/infrastructure/config/config.service';
import { Guard } from '@/shared/domain/guards';

import { FeatureFlag } from './feature-flags.enum';

export const FEATURE_FLAGS_SERVICE_PROVIDER = Symbol('FeatureFlagsService');

@Injectable()
export class FeatureFlagsService implements OnModuleDestroy, OnModuleInit {
  private unleash: null | Unleash = null;

  public constructor(private readonly configService: ConfigService) {}

  public isEnabled(flagName: FeatureFlag): boolean {
    if (!this.unleash) {
      return false;
    }

    return this.unleash.isEnabled(flagName);
  }

  public onModuleDestroy(): void {
    this.unleash?.destroy();
  }

  public async onModuleInit(): Promise<void> {
    this.unleash = initialize({
      appName: this.configService.unleashAppName,
      customHeaders: {
        Authorization: this.configService.unleashApiKey,
      },
      refreshInterval: 5000,
      url: this.configService.unleashUrl,
    });

    await new Promise<void>((resolve) => {
      Guard.defined(this.unleash);
      this.unleash.on('ready', () => {
        resolve();
      });

      this.unleash.on('error', () => {
        resolve();
      });
    });
  }
}
