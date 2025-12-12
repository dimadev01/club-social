import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { BetterAuthService } from '@/infrastructure/auth/better-auth.service';
import { EmailModule } from '@/infrastructure/email/email.module';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  controllers: [AuthController],
  exports: [BetterAuthService],
  imports: [EmailModule],
  providers: [
    BetterAuthService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
