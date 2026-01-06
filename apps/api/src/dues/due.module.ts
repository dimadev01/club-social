import { Module } from '@nestjs/common';

import { CreateDueUseCase } from './application/create-due.use-case';
import { UpdateDueUseCase } from './application/update-due.use-case';
import { VoidDueUseCase } from './application/void-due.use-case';
import { DueEventHandler } from './infrastructure/handlers/due-event.handler';
import { DuesController } from './presentation/due.controller';

@Module({
  controllers: [DuesController],
  exports: [],
  imports: [],
  providers: [
    CreateDueUseCase,
    UpdateDueUseCase,
    VoidDueUseCase,
    DueEventHandler,
  ],
})
export class DuesModule {}
