import { DueCategoryEnum } from '@domain/dues/due.enum';
import { DueMember } from '@domain/dues/entities/due-member';

export interface CreateDue {
  amount: number;
  category: DueCategoryEnum;
  date: string;
  member: DueMember;
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
