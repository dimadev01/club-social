import { Module } from '@nestjs/common';

import { CreateMovementUseCase } from './application/create-movement.use-case';
import { VoidMovementUseCase } from './application/void-movement.use-case';
import { MOVEMENT_REPOSITORY_PROVIDER } from './domain/movement.repository';
import { PaymentCreatedHandler } from './infrastructure/events/payment-created.handler';
import { PrismaMovementMapper } from './infrastructure/prisma-movement.mapper';
import { PrismaMovementRepository } from './infrastructure/prisma-movement.repository';
import { MovementsController } from './presentation/movement.controller';

@Module({
  controllers: [MovementsController],
  exports: [MOVEMENT_REPOSITORY_PROVIDER],
  providers: [
    CreateMovementUseCase,
    VoidMovementUseCase,
    PrismaMovementMapper,
    {
      provide: MOVEMENT_REPOSITORY_PROVIDER,
      useClass: PrismaMovementRepository,
    },
    PaymentCreatedHandler,
  ],
})
export class MovementsModule {}
