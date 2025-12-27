import { MemberEntity } from '@/members/domain/entities/member.entity';
import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { DueSettlementEntity } from './entities/due-settlement.entity';
import { DueEntity } from './entities/due.entity';

export interface DueDetailModel {
  due: DueEntity;
  member: MemberEntity;
  user: UserEntity;
}

export interface DuePaginatedExtraModel {
  totalAmount: number;
}

export interface DuePaginatedModel {
  due: DueEntity;
  member: MemberEntity;
  user: UserEntity;
}

export interface PaymentDueDetailModel {
  payment: PaymentEntity;
  settlement: DueSettlementEntity;
}
