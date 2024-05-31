import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface FindMembersRequest {
  category?: MemberCategoryEnum[];
  status?: MemberStatusEnum[];
}
