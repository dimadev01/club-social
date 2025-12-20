import { Module } from '@nestjs/common';

import { CreateDueUseCase } from './application/create-due/create-due.use-case';
import { RecalculateDueService } from './application/recalculate-due/recalculate-due.service';
import { UpdateDueUseCase } from './application/update-due/update-due.use-case';
import { VoidDueUseCase } from './application/void-due/void-due.use-case';
import { DUE_REPOSITORY_PROVIDER } from './domain/due.repository';
import { PrismaDueRepository } from './infrastructure/prisma-due.repository';
import { DuesController } from './presentation/due.controller';

@Module({
  controllers: [DuesController],
  exports: [DUE_REPOSITORY_PROVIDER, RecalculateDueService],
  imports: [],
  providers: [
    CreateDueUseCase,
    UpdateDueUseCase,
    VoidDueUseCase,
    RecalculateDueService,
    {
      provide: DUE_REPOSITORY_PROVIDER,
      useClass: PrismaDueRepository,
    },
  ],
})
export class DuesModule {}
