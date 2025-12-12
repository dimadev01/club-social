import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { BetterAuth } from '@/infrastructure/auth/better-auth.config';
import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';
import { EmailModule } from '@/infrastructure/email/email.module';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  exports: [BetterAuth],
  imports: [PrismaModule, EmailModule],
  providers: [
    AuthGuard,
    BetterAuth,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
