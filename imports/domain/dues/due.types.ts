import { DueCategoryEnum } from '@domain/dues/due.enum';

export interface CreateDue {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  memberId: string;
  notes: string | null;
}

export interface CreateDueMember {
  _id: string;
  name: string;
}

export interface CreateDuePayment {
  _id: string;
  amount: number;
  date: Date;
}
