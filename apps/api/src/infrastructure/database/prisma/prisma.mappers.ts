import { Injectable } from '@nestjs/common';

import { PrismaDueMapper } from '@/dues/infrastructure/prisma-due.mapper';
import { PrismaMemberMapper } from '@/members/infrastructure/prisma-member.mapper';
import { PrismaMovementMapper } from '@/movements/infrastructure/prisma-movement.mapper';
import { PrismaPaymentDueMapper } from '@/payments/infrastructure/prisma-payment-due.mapper';
import { PrismaPaymentMapper } from '@/payments/infrastructure/prisma-payment.mapper';
import { PrismaUserMapper } from '@/users/infrastructure/prisma-user.mapper';

@Injectable()
export class PrismaMappers {
  public constructor(
    public readonly due: PrismaDueMapper,
    public readonly member: PrismaMemberMapper,
    public readonly movement: PrismaMovementMapper,
    public readonly payment: PrismaPaymentMapper,
    public readonly paymentDue: PrismaPaymentDueMapper,
    public readonly user: PrismaUserMapper,
  ) {}
}
