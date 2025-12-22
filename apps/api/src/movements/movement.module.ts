import { Module } from '@nestjs/common';

import { CreateMovementUseCase } from './application/create-movement/create-movement.use-case';
import { VoidMovementUseCase } from './application/void-movement/void-movement.use-case';
import { MOVEMENT_REPOSITORY_PROVIDER } from './domain/movement.repository';
import { PaymentCreatedHandler } from './infrastructure/events/payment-created.handler';
import { PrismaMovementRepository } from './infrastructure/prisma-movement.repository';
import { MovementsController } from './presentation/movement.controller';

@Module({
  controllers: [MovementsController],
  exports: [MOVEMENT_REPOSITORY_PROVIDER],
  providers: [
    CreateMovementUseCase,
    VoidMovementUseCase,
    {
      provide: MOVEMENT_REPOSITORY_PROVIDER,
      useClass: PrismaMovementRepository,
    },
    PaymentCreatedHandler,
  ],
})
export class MovementsModule {}
