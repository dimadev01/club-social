import { Module } from '@nestjs/common';

import { UsersModule } from '@/users/user.module';

import { CreateMemberUseCase } from './application/create-member.use-case';
import { UpdateMemberUseCase } from './application/update-member.use-case';
import { MEMBER_REPOSITORY_PROVIDER } from './domain/member.repository';
import { PrismaMemberMapper } from './infrastructure/prisma-member.mapper';
import { PrismaMemberRepository } from './infrastructure/prisma-member.repository';
import { PrismaMemberLedgerEntryMapper } from './ledger/infrastructure/prisma-member-ledger.mapper';
import { PrismaMemberLedgerRepository } from './ledger/infrastructure/prisma-member-ledger.repository';
import { MEMBER_LEDGER_REPOSITORY_PROVIDER } from './ledger/member-ledger.repository';
import { MemberLedgerController } from './ledger/presentation/member-ledger.controller';
import { MembersController } from './presentation/member.controller';

@Module({
  controllers: [MembersController, MemberLedgerController],
  exports: [
    MEMBER_REPOSITORY_PROVIDER,
    MEMBER_LEDGER_REPOSITORY_PROVIDER,
    CreateMemberUseCase,
  ],
  imports: [UsersModule],
  providers: [
    CreateMemberUseCase,
    UpdateMemberUseCase,
    PrismaMemberMapper,
    PrismaMemberLedgerEntryMapper,
    {
      provide: MEMBER_REPOSITORY_PROVIDER,
      useClass: PrismaMemberRepository,
    },
    {
      provide: MEMBER_LEDGER_REPOSITORY_PROVIDER,
      useClass: PrismaMemberLedgerRepository,
    },
  ],
})
export class MembersModule {}
