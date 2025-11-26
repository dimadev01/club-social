import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

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
}
