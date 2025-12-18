import { Module } from '@nestjs/common';

import { DuesModule } from '@/dues/due.module';
import { UsersModule } from '@/users/user.module';

import { CreateMemberUseCase } from './application/create-member/create-member.use-case';
import { UpdateMemberUseCase } from './application/update-member/update-member.use-case';
import { MEMBER_REPOSITORY_PROVIDER } from './domain/member.repository';
import { PrismaMemberMapper } from './infrastructure/prisma-member.mapper';
import { PrismaMemberRepository } from './infrastructure/prisma-member.repository';
import { MembersController } from './presentation/member.controller';

@Module({
  controllers: [MembersController],
  exports: [MEMBER_REPOSITORY_PROVIDER, CreateMemberUseCase],
  imports: [UsersModule, DuesModule],
  providers: [
    CreateMemberUseCase,
    UpdateMemberUseCase,
    {
      provide: MEMBER_REPOSITORY_PROVIDER,
      useClass: PrismaMemberRepository,
    },
    PrismaMemberMapper,
  ],
})
export class MembersModule {}
