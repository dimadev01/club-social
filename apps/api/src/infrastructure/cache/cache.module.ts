import { CacheModule as NestJsCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  exports: [NestJsCacheModule],
  imports: [NestJsCacheModule.register()],
})
export class CacheModule {}
