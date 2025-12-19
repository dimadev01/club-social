import { Injectable } from '@nestjs/common';

import { PrismaDueMapper } from '@/dues/infrastructure/prisma-due.mapper';
import { PrismaMemberMapper } from '@/members/infrastructure/prisma-member.mapper';
import { PrismaUserMapper } from '@/users/infrastructure/prisma-user.mapper';

@Injectable()
export class PrismaMappers {
  public constructor(
    public readonly due: PrismaDueMapper,
    public readonly member: PrismaMemberMapper,
    public readonly user: PrismaUserMapper,
  ) {}
}
