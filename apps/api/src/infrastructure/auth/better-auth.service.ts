import { Injectable } from '@nestjs/common';
import { type Auth } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { auth } from './better-auth.config';

@Injectable()
export class BetterAuthService implements AuthService {
  public get auth() {
    return this._auth;
  }

  private readonly _auth: Auth;

  public constructor() {
    this._auth = auth;
  }

  public async isValid(req: Request): Promise<boolean> {
    const session = await this._auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    return !!(session && session.user);
  }
}
