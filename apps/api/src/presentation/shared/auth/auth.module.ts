import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { BetterAuthService } from '@/infrastructure/auth/better-auth.service';
import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  exports: [BetterAuthService],
  imports: [PrismaModule],
  providers: [
    AuthGuard,
    BetterAuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
