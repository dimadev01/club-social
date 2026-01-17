import { Module } from '@nestjs/common';

import { CreateDueUseCase } from './application/create-due.use-case';
import { UpdateDueUseCase } from './application/update-due.use-case';
import { VoidDueUseCase } from './application/void-due.use-case';
import { DuesController } from './presentation/due.controller';

@Module({
  controllers: [DuesController],
  providers: [CreateDueUseCase, UpdateDueUseCase, VoidDueUseCase],
})
export class DuesModule {}
