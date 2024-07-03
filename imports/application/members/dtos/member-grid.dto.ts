import {
  MemberCategoryEnum,
  MemberStatusEnum,
} from '@domain/members/member.enum';

export interface MemberGridDto {
  category: MemberCategoryEnum;
  email: string | null;
  id: string;
  name: string;
  pendingElectricity: number;
  pendingGuest: number;
  pendingMembership: number;
  pendingTotal: number;
  phones: string;
  status: MemberStatusEnum;
}
