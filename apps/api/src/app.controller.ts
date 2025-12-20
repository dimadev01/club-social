import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { PublicRoute } from './shared/presentation/decorators/public-route.decorator';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get('test-error')
  public getError(): void {
    throw new Error('Test error');
  }

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @Post('seed')
  @PublicRoute()
  public async seed(): Promise<void> {
    return this.appService.seed();
  }
}
