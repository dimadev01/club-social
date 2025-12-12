import type { Request, Response } from 'express';

import { All, Controller, Req, Res } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';

import { BetterAuth } from '@/infrastructure/auth/better-auth.config';

import { PublicRoute } from './public-route.decorator';

@Controller()
export class AuthController {
  public constructor(private readonly betterAuth: BetterAuth) {}

  @All('auth/*path')
  @PublicRoute()
  public async handle(@Req() request: Request, @Res() response: Response) {
    return toNodeHandler(this.betterAuth.auth)(request, response);
  }
}
