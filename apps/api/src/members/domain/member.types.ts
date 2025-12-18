import { DueEntity } from '@/dues/domain/entities/due.entity';
import { PaymentEntity } from '@/payments/domain/entities/payment.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { MemberEntity } from './entities/member.entity';

export interface FindMembersModelParams {
  includeUser?: boolean;
}

export interface MemberDetailModel {
  dues: DueEntity[];
  member: MemberEntity;
  payments: PaymentEntity[];
  user: UserEntity;
}

export interface MemberListModel {
  member: MemberEntity;
  user: UserEntity;
}

export interface MemberPaginatedModel {
  member: MemberEntity;
  user: UserEntity;
}
