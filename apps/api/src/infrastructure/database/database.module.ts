import { Global, Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  exports: [PrismaModule],
  imports: [PrismaModule],
  providers: [],
})
export class DatabaseModule {}
