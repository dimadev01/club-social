import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { BetterAuthService } from '@/infrastructure/auth/better-auth/better-auth.service';
import { MembersModule } from '@/members/member.module';
import { AuthController } from '@/shared/presentation/auth/auth.controller';
import { AuthGuard } from '@/shared/presentation/auth/auth.guard';
import { MaintenanceModeGuard } from '@/shared/presentation/guards/maintenance-mode.guard';
import { UsersModule } from '@/users/user.module';

@Global()
@Module({
  controllers: [AuthController],
  exports: [BetterAuthService],
  imports: [MembersModule, UsersModule],
  providers: [
    BetterAuthService,
    AuthGuard,
    MaintenanceModeGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: MaintenanceModeGuard,
    },
  ],
})
export class AuthModule {}
