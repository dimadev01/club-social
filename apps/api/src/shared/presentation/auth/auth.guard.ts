import type { Cache } from 'cache-manager';
import type { Request } from 'express';

import { UserRole } from '@club-social/shared/users';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { fromNodeHeaders } from 'better-auth/node';

import type { AuthSession } from '@/infrastructure/auth/better-auth/better-auth.types';
import type { MemberRepository } from '@/members/domain/member.repository';

import { BetterAuthService } from '@/infrastructure/auth/better-auth/better-auth.service';
import { MEMBER_REPOSITORY_PROVIDER } from '@/members/domain/member.repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';

const MEMBER_CACHE_TTL_MS = 300_000; // 5 minutes

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly betterAuth: BetterAuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(MEMBER_REPOSITORY_PROVIDER)
    private readonly memberRepository: MemberRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<Request & { session: AuthSession | null }>();

    const session = await this.betterAuth.auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return false;
    }

    req.session = session;

    if (session.user.role === UserRole.MEMBER) {
      const cacheKey = `member:userId:${session.user.id}`;
      let memberId = await this.cacheManager.get<string>(cacheKey);

      if (!memberId) {
        const member = await this.memberRepository.findUniqueByUserId(
          UniqueId.raw({ value: session.user.id }),
        );
        memberId = member.id.value;
        await this.cacheManager.set(cacheKey, memberId, MEMBER_CACHE_TTL_MS);
      }

      req.session.memberId = memberId;
    }

    return true;
  }
}
