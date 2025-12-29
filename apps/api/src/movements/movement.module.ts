import { Module } from '@nestjs/common';

import { CreateMovementUseCase } from './application/create-movement.use-case';
import { VoidMovementUseCase } from './application/void-movement.use-case';
import { MovementsController } from './presentation/movement.controller';

@Module({
  controllers: [MovementsController],
  exports: [],
  providers: [CreateMovementUseCase, VoidMovementUseCase],
})
export class MovementsModule {}
