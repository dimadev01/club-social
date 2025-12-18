import { Module } from '@nestjs/common';

import { MembersModule } from '@/members/member.module';

import { CreateDueUseCase } from './application/create-due/create-due.use-case';
import { UpdateDueUseCase } from './application/update-due/update-due.use-case';
import { DUE_REPOSITORY_PROVIDER } from './domain/due.repository';
import { PrismaDueMapper } from './infrastructure/prisma-due.mapper';
import { PrismaDueRepository } from './infrastructure/prisma-due.repository';
import { DuesController } from './presentation/due.controller';

@Module({
  controllers: [DuesController],
  exports: [DUE_REPOSITORY_PROVIDER, PrismaDueMapper],
  imports: [MembersModule],
  providers: [
    CreateDueUseCase,
    UpdateDueUseCase,
    {
      provide: DUE_REPOSITORY_PROVIDER,
      useClass: PrismaDueRepository,
    },
    PrismaDueMapper,
  ],
})
export class DuesModule {}
