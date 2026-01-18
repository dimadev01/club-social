import { DateUtils } from '@club-social/shared/lib';
import { RedisService } from '@nestjs-labs/nestjs-ioredis';
import { Injectable } from '@nestjs/common';
import { toNumber } from 'es-toolkit/compat';

import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';

export const EmailCategory = {
  CRITICAL: 'critical',
  NOTIFICATION: 'notification',
} as const;

export type EmailCategory = (typeof EmailCategory)[keyof typeof EmailCategory];

const DAILY_LIMITS: Record<EmailCategory, number> = {
  [EmailCategory.CRITICAL]: 10,
  [EmailCategory.NOTIFICATION]: 90,
};

@Injectable()
export class EmailRateLimitService {
  public constructor(private readonly redisService: RedisService) {}

  public async canSendEmail(category: EmailCategory): Promise<boolean> {
    const count = await this.getDailyCount(category);

    return count < DAILY_LIMITS[category];
  }

  public async getDailyCount(category: EmailCategory): Promise<number> {
    const redis = this.redisService.getOrThrow();
    const key = this.getDailyKey(category);
    const count = await redis.get(key);

    return toNumber(count ?? '0');
  }

  public async getRemainingQuota(category: EmailCategory): Promise<number> {
    const count = await this.getDailyCount(category);

    return Math.max(0, DAILY_LIMITS[category] - count);
  }

  public async incrementAndCheck(category: EmailCategory): Promise<{
    allowed: boolean;
    count: number;
    limit: number;
  }> {
    const redis = this.redisService.getOrThrow();
    const key = this.getDailyKey(category);
    const limit = DAILY_LIMITS[category];

    // Check first
    const currentCount = await redis.get(key);
    const count = toNumber(currentCount ?? '0');

    if (count >= limit) {
      return { allowed: false, count, limit };
    }

    // Then increment
    const newCount = await redis.incr(key);

    if (newCount === 1) {
      // Expire at midnight UTC
      const secondsUntilMidnight = Math.ceil(
        DateUtils.getDelayUntilMidnight() / 1000,
      );
      await redis.expire(key, secondsUntilMidnight);
    }

    // Double-check after increment (handles race condition)
    if (newCount > limit) {
      await redis.decr(key);

      return { allowed: false, count: newCount - 1, limit };
    }

    return { allowed: true, count: newCount, limit };
  }

  private getDailyKey(category: EmailCategory): string {
    const today = DateOnly.today().value;

    return `email:daily:${category}:${today}`;
  }
}
