import { DueCategory } from '@club-social/shared/dues';

export interface CreateDueParams {
  amount: number;
  category: DueCategory;
  createdBy: string;
  date: Date;
  memberId: string;
  notes: null | string;
}
