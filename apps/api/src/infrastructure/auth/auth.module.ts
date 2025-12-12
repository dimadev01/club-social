import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { BetterAuthService } from '@/infrastructure/auth/better-auth/better-auth.service';
import { EmailModule } from '@/infrastructure/email/email.module';
import { AuthController } from '@/shared/presentation/auth/auth.controller';
import { AuthGuard } from '@/shared/presentation/auth/auth.guard';

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
