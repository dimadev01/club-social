import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from '@/infrastructure/config/config.service';

@Module({
  exports: [],
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.mongoUri,
      }),
    }),
  ],
  providers: [],
})
export class MongoModule {}
