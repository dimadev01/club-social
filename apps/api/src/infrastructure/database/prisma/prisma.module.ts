import { Module } from '@nestjs/common';

import { PrismaDueMapper } from '@/dues/infrastructure/prisma-due.mapper';
import { PrismaMemberMapper } from '@/members/infrastructure/prisma-member.mapper';
import { PrismaUserMapper } from '@/users/infrastructure/prisma-user.mapper';

import { PrismaMappers } from './prisma.mappers';
import { PrismaService } from './prisma.service';

@Module({
  exports: [PrismaMappers, PrismaService],
  imports: [],
  providers: [
    PrismaDueMapper,
    PrismaMemberMapper,
    PrismaUserMapper,
    PrismaMappers,
    PrismaService,
  ],
})
export class PrismaModule {}
