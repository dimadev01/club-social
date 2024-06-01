import { DueCategoryEnum } from '@domain/dues/due.enum';

export interface CreateDueOld {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  memberId: string;
  notes: string | null;
}

export interface CreateDueMemberOld {
  _id: string;
  name: string;
}

export interface CreateDuePaymentOld {
  _id: string;
  amount: number;
  date: Date;
}
