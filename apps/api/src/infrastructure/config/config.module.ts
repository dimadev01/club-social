import { ConfigifyModule } from '@itgorillaz/configify';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  exports: [],
  imports: [ConfigifyModule.forRootAsync()],
  providers: [],
})
export class ConfigModule {}
