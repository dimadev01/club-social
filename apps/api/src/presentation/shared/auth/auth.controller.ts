import type { Request, Response } from 'express';

import { All, Controller, Req, Res } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';

import { BetterAuthService } from '@/infrastructure/auth/better-auth.service';

import { PublicRoute } from './public-route.decorator';

@Controller()
export class AuthController {
  public constructor(private readonly betterAuthService: BetterAuthService) {}

  @All('api/auth/*any')
  @PublicRoute()
  public async handle(@Req() request: Request, @Res() response: Response) {
    return toNodeHandler(this.betterAuthService.auth)(request, response);
  }
}
