import { Global, Module } from '@nestjs/common';

import { FeatureFlagsController } from './feature-flags.controller';
import {
  FEATURE_FLAGS_SERVICE_PROVIDER,
  FeatureFlagsService,
} from './feature-flags.service';

@Global()
@Module({
  controllers: [FeatureFlagsController],
  exports: [FEATURE_FLAGS_SERVICE_PROVIDER],
  providers: [
    FeatureFlagsService,
    {
      provide: FEATURE_FLAGS_SERVICE_PROVIDER,
      useExisting: FeatureFlagsService,
    },
  ],
})
export class FeatureFlagsModule {}
