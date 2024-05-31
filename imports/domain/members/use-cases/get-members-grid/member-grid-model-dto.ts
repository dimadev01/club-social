import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface MemberGridModelDto {
  _id: string;
  category: MemberCategoryEnum;
  name: string;
  pendingElectricity: number;
  pendingGuest: number;
  pendingMembership: number;
  pendingTotal: number;
  status: MemberStatusEnum;
}
