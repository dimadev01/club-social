import { Module } from '@nestjs/common';

import { UsersModule } from '@/users/user.module';

import { CreateMemberUseCase } from './application/create-member.use-case';
import { UpdateMemberUseCase } from './application/update-member.use-case';
import { CreateMemberLedgerEntryUseCase } from './ledger/application/create-member-ledger-entry.use-case';
import { MemberLedgerController } from './ledger/presentation/member-ledger.controller';
import { MembersController } from './presentation/member.controller';

@Module({
  controllers: [MembersController, MemberLedgerController],

  imports: [UsersModule],
  providers: [
    CreateMemberUseCase,
    CreateMemberLedgerEntryUseCase,
    UpdateMemberUseCase,
  ],
})
export class MembersModule {}
