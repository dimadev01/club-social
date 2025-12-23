import { DueEntity } from '@/dues/domain/entities/due.entity';
import { MemberEntity } from '@/members/domain/entities/member.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { PaymentDueEntity } from './entities/payment-due.entity';
import { PaymentEntity } from './entities/payment.entity';

export interface PaymentDetailModel {
  member: MemberEntity;
  payment: PaymentEntity;
  user: UserEntity;
}

export interface PaymentDueDetailModel {
  due: DueEntity;
  paymentDue: PaymentDueEntity;
}

export interface PaymentPaginatedModel {
  member: MemberEntity;
  payment: PaymentEntity;
  user: UserEntity;
}

export interface PaymentPaginatedSummaryModel {
  totalAmount: number;
}
