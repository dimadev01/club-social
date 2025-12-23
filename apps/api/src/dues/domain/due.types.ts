import { MemberEntity } from '@/members/domain/entities/member.entity';
import { PaymentDueEntity } from '@/payments/domain/entities/payment-due.entity';
import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { DueEntity } from './entities/due.entity';

export interface DueDetailModel {
  due: DueEntity;
  member: MemberEntity;
  user: UserEntity;
}

export interface DuePaginatedModel {
  due: DueEntity;
  member: MemberEntity;
  user: UserEntity;
}

export interface PaymentDueDetailModel {
  payment: PaymentEntity;
  paymentDue: PaymentDueEntity;
}
