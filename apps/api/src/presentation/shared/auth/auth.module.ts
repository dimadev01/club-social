import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AUTH_SERVICE_PROVIDER } from '@/infrastructure/auth/auth.service';
import { BetterAuthService } from '@/infrastructure/auth/better-auth.service';
import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  exports: [BetterAuthService],
  imports: [PrismaModule],
  providers: [
    BetterAuthService,
    {
      provide: AUTH_SERVICE_PROVIDER,
      useClass: BetterAuthService,
    },
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
