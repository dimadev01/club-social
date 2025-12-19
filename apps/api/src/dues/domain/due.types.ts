import { MemberEntity } from '@/members/domain/entities/member.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';

import { DueEntity } from './entities/due.entity';

export interface DuePaginatedModel {
  due: DueEntity;
  member: MemberEntity;
  user: UserEntity;
}
