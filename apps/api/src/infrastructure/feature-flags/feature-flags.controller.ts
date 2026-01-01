import { Controller, Get } from '@nestjs/common';

import { PublicRoute } from '@/shared/presentation/decorators/public-route.decorator';
import { SkipMaintenanceCheck } from '@/shared/presentation/decorators/skip-maintenance-check.decorator';

import { FeatureFlag } from './feature-flags.enum';
import { FeatureFlagsService } from './feature-flags.service';
import { FlagResponseDto } from './flag-response.dto';

@Controller('feature-flags')
@PublicRoute()
@SkipMaintenanceCheck()
export class FeatureFlagsController {
  public constructor(
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  @Get('maintenance-mode')
  public getMaintenanceMode(): FlagResponseDto {
    return {
      enabled: this.featureFlagsService.isEnabled(FeatureFlag.MAINTENANCE_MODE),
    };
  }
}
