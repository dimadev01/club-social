import { UserStatus } from '../users';
import { DueCategory, DueStatus } from './due.enum';

export interface CreateDueDto {
  amount: number;
  category: DueCategory;
  date: string;
  memberId: string;
  notes: null | string;
}

export interface IDueDetailDto {
  amount: number;
  category: DueCategory;
  createdAt: string;
  date: string;
  id: string;
  memberId: string;
  status: DueStatus;
}

export interface IDuePaginatedDto {
  amount: number;
  category: DueCategory;
  createdAt: string;
  date: string;
  id: string;
  memberId: string;
  memberName: string;
  memberUserStatus: UserStatus;
  notes: null | string;
  status: DueStatus;
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
