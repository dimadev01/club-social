import { UserStatus } from '@club-social/shared/users';
import { Injectable } from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { IncomingHttpHeaders } from 'http';

import { ConfigService } from '@/infrastructure/config/config.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';
import { CreateUserParams } from '@/users/application/create-user/create-user.params';

import { type auth, createBetterAuth } from './better-auth.service';

@Injectable()
export class BetterAuthServiceOld {
  public get auth() {
    return this._auth;
  }

  private readonly _auth: typeof auth;

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
          status: UserStatus.ACTIVE,
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
}
