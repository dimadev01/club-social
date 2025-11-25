import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './infrastructure/config/config.module';
import { UsersModule } from './presentation/users/users.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule,

    /**
     * Domain
     */
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
