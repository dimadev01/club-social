import { Global, Module } from '@nestjs/common';

import { CsvService } from './csv.service';

@Global()
@Module({
  exports: [CsvService],
  providers: [CsvService],
})
export class CsvModule {}
