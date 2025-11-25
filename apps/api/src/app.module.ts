import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './infrastructure/config/config.module';

@Module({
  controllers: [AppController],
  imports: [ConfigModule],
  providers: [AppService],
})
export class AppModule {}
