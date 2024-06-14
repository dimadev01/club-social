import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export interface MovementGridDto {
  amount: number;
  category: MovementCategoryEnum;
  createdAt: string;
  date: string;
  id: string;
  isExpense: boolean;
  isIncome: boolean;
  isRegistered: boolean;
  isVoided: boolean;
  notes: string | null;
  paymentId: string | null;
  paymentMemberName: string | null;
  status: MovementStatusEnum;
  type: MovementTypeEnum;
}
