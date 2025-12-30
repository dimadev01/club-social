import { Global, Module } from '@nestjs/common';

import { MongoModule } from './mongo/mongo.module';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  exports: [PrismaModule, MongoModule],
  imports: [PrismaModule, MongoModule],
  providers: [],
})
export class DatabaseModule {}
