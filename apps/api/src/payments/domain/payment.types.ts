import { MemberEntity } from '@/members/domain/entities/member.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { PaymentEntity } from './entities/payment.entity';

export interface PaymentDetailModel {
  member: MemberEntity;
  payment: PaymentEntity;
  user: UserEntity;
}

export interface PaymentPaginatedModel {
  member: MemberEntity;
  payment: PaymentEntity;
  user: UserEntity;
}
