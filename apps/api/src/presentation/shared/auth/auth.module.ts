import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from '@/infrastructure/config/config.service';

import { AuthGuard } from './auth.guard';

@Module({
  exports: [AuthGuard],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: () => ({
        secret: 'super-secret-jwt-token-with-at-least-32-characters-long',
        signOptions: {
          algorithm: 'HS256',
          expiresIn: '1h',
        },
      }),
    }),
  ],
  providers: [
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
