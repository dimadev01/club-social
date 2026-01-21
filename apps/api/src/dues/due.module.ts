import { Module } from '@nestjs/common';

import { PricingModule } from '../pricing/pricing.module';
import { CreateDueUseCase } from './application/create-due.use-case';
import { PreviewBulkDuesUseCase } from './application/preview-bulk-dues/preview-bulk-dues.use-case';
import { UpdateDueUseCase } from './application/update-due.use-case';
import { VoidDueUseCase } from './application/void-due.use-case';
import { DuesController } from './presentation/due.controller';

@Module({
  controllers: [DuesController],
  imports: [PricingModule],
  providers: [
    CreateDueUseCase,
    PreviewBulkDuesUseCase,
    UpdateDueUseCase,
    VoidDueUseCase,
  ],
})
export class DuesModule {}
