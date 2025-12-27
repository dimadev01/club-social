import { Injectable } from '@nestjs/common';

import { PrismaAuditLogMapper } from '@/audit/infrastructure/prisma-audit-log.mapper';
import { PrismaDueSettlementMapper } from '@/dues/infrastructure/prisma-due-settlement.mapper';
import { PrismaDueMapper } from '@/dues/infrastructure/prisma-due.mapper';
import { PrismaMemberLedgerEntryMapper } from '@/members/infrastructure/prisma-member-ledger.mapper';
import { PrismaMemberMapper } from '@/members/infrastructure/prisma-member.mapper';
import { PrismaMovementMapper } from '@/movements/infrastructure/prisma-movement.mapper';
import { PrismaPaymentMapper } from '@/payments/infrastructure/prisma-payment.mapper';
import { PrismaUserMapper } from '@/users/infrastructure/prisma-user.mapper';

@Injectable()
export class PrismaMappers {
  public constructor(
    public readonly due: PrismaDueMapper,
    public readonly dueSettlement: PrismaDueSettlementMapper,
    public readonly member: PrismaMemberMapper,
    public readonly memberLedgerEntry: PrismaMemberLedgerEntryMapper,
    public readonly movement: PrismaMovementMapper,
    public readonly payment: PrismaPaymentMapper,
    public readonly user: PrismaUserMapper,
    public readonly auditLog: PrismaAuditLogMapper,
  ) {}
}
