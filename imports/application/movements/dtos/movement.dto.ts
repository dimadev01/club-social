import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export interface MovementDto {
  amount: number;
  category: MovementCategoryEnum;
  createdAt: string;
  date: string;
  employeeId: string | null;
  id: string;
  notes: string | null;
  paymentId: string | null;
  professorId: string | null;
  serviceId: string | null;
  status: MovementStatusEnum;
  type: MovementTypeEnum;
}
