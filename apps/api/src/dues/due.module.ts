import { Module } from '@nestjs/common';

import { CreateDueUseCase } from './application/create-due.use-case';
import { UpdateDueUseCase } from './application/update-due.use-case';
import { VoidDueUseCase } from './application/void-due.use-case';
import { DUE_REPOSITORY_PROVIDER } from './domain/due.repository';
import { PrismaDueSettlementMapper } from './infrastructure/prisma-due-settlement.mapper';
import { PrismaDueMapper } from './infrastructure/prisma-due.mapper';
import { PrismaDueRepository } from './infrastructure/prisma-due.repository';
import { DuesController } from './presentation/due.controller';

@Module({
  controllers: [DuesController],
  exports: [DUE_REPOSITORY_PROVIDER],
  imports: [],
  providers: [
    CreateDueUseCase,
    UpdateDueUseCase,
    VoidDueUseCase,
    PrismaDueMapper,
    PrismaDueSettlementMapper,
    {
      provide: DUE_REPOSITORY_PROVIDER,
      useClass: PrismaDueRepository,
    },
  ],
})
export class DuesModule {}
