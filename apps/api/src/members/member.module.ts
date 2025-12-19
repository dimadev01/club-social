import { Module } from '@nestjs/common';

import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';
import { UsersModule } from '@/users/user.module';

import { CreateMemberUseCase } from './application/create-member/create-member.use-case';
import { UpdateMemberUseCase } from './application/update-member/update-member.use-case';
import { MEMBER_REPOSITORY_PROVIDER } from './domain/member.repository';
import { PrismaMemberRepository } from './infrastructure/prisma-member.repository';
import { MembersController } from './presentation/member.controller';

@Module({
  controllers: [MembersController],
  exports: [MEMBER_REPOSITORY_PROVIDER, CreateMemberUseCase],
  imports: [PrismaModule, UsersModule],
  providers: [
    CreateMemberUseCase,
    UpdateMemberUseCase,
    {
      provide: MEMBER_REPOSITORY_PROVIDER,
      useClass: PrismaMemberRepository,
    },
  ],
})
export class MembersModule {}
