import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export interface MovementDto {
  amount: number;
  category: MovementCategoryEnum;
  createdAt: string;
  createdBy: string;
  date: string;
  employeeId: string | null;
  id: string;
  isRegistered: boolean;
  isUpdatable: boolean;
  isVoidable: boolean;
  isVoided: boolean;
  notes: string | null;
  paymentId: string | null;
  professorId: string | null;
  serviceId: string | null;
  status: MovementStatusEnum;
  type: MovementTypeEnum;
  voidReason: string | null;
  voidedAt: string | null;
  voidedBy: string | null;
}
