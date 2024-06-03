import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface MemberGridDto {
  category: MemberCategoryEnum;
  id: string;
  name: string;
  pendingElectricity: number;
  pendingGuest: number;
  pendingMembership: number;
  pendingTotal: number;
  status: MemberStatusEnum;
}
