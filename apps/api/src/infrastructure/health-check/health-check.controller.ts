import { Controller, Get } from '@nestjs/common';

import { PublicRoute } from '@/shared/presentation/decorators/public-route.decorator';

@Controller('health')
@PublicRoute()
export class HealthCheckController {
  @Get()
  public getHealth(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
