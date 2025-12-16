import { DueCategory, DueStatus } from './due.enum';

export interface CreateDueDto {
  amount: number;
  category: DueCategory;
  date: string;
  memberId: string;
  notes: null | string;
}

export interface DueDto {
  amount: number;
  category: DueCategory;
  createdAt: string;
  createdBy: string;
  date: string;
  id: string;
  memberId: string;
  notes: null | string;
  status: DueStatus;
  updatedAt: string;
  updatedBy: null | string;
  voidedAt: null | string;
  voidedBy: null | string;
  voidReason: null | string;
}

export interface UpdateDueDto {
  amount: number;
  category: DueCategory;
  date: string;
  notes: null | string;
}

export interface VoidDueDto {
  voidReason: string;
}
