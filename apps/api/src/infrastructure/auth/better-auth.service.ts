import { Injectable } from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

import { CreateUserParams } from '@/application/users/create-user/create-user.params';
import { UpdateUserParams } from '@/application/users/update-user/update-user.params';
import { UniqueId } from '@/domain/shared/value-objects/unique-id/unique-id.vo';

import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { createBetterAuth } from './better-auth.config';

@Injectable()
export class BetterAuthService implements AuthService {
  public get auth() {
    return this._auth;
  }

  private readonly _auth;

  public constructor(private readonly configService: ConfigService) {
    this._auth = createBetterAuth({
      trustedOrigins: this.configService.trustedOrigins,
    });
  }

  public async createUser(
    params: CreateUserParams,
    headers: IncomingHttpHeaders,
  ): Promise<void> {
    await this._auth.api.createUser({
      body: {
        data: {
          createdBy: params.createdBy,
          deletedAt: null,
          deletedBy: null,
          firstName: params.firstName,
          lastName: params.lastName,
          updatedBy: params.createdBy,
        },
        email: params.email,
        name: `${params.firstName} ${params.lastName}`,
        password: UniqueId.generate().value,
        role: params.role,
      },
      headers: fromNodeHeaders(headers),
    });
  }

  public async isValid(req: Request): Promise<boolean> {
    const session = await this._auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    return !!(session && session.user);
  }

  public async updateUser(
    params: UpdateUserParams,
    headers: IncomingHttpHeaders,
  ): Promise<void> {
    await this._auth.api.adminUpdateUser({
      body: {
        data: {
          email: params.email,
          firstName: params.firstName,
          lastName: params.lastName,
        },
        userId: params.id,
      },
      headers: fromNodeHeaders(headers),
    });
  }
}
