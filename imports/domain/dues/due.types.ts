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
  firstName: string;
  lastName: string;
}
