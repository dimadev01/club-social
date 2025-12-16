import { UserEntity } from '@/users/domain/entities/user.entity';

import { MemberEntity } from './entities/member.entity';

export interface FindMembersModelParams {
  includeUser?: boolean;
}

export interface MemberModel {
  member: MemberEntity;
  user?: UserEntity;
}
