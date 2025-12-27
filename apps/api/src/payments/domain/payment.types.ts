import { DueSettlementEntity } from '@/dues/domain/entities/due-settlement.entity';
import { DueEntity } from '@/dues/domain/entities/due.entity';
import { MemberEntity } from '@/members/domain/entities/member.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { PaymentEntity } from './entities/payment.entity';

export interface PaymentDetailModel {
  member: MemberEntity;
  payment: PaymentEntity;
  user: UserEntity;
}

export interface PaymentDueDetailModel {
  due: DueEntity;
  dueSettlement: DueSettlementEntity;
}

export interface PaymentPaginatedExtraModel {
  totalAmount: number;
}

export interface PaymentPaginatedModel {
  member: MemberEntity;
  payment: PaymentEntity;
  user: UserEntity;
}

export interface PaymentStatisticsModel {
  due: DueEntity;
  dueSettlement: DueSettlementEntity;
  payment: PaymentEntity;
}
