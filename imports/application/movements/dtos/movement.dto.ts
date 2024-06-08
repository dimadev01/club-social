import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export interface MovementDto {
  amount: number;
  category: MovementCategoryEnum;
  date: string;
  employeeId: string | null;
  id: string;
  notes: string | null;
  paymentId: string | null;
  professorId: string | null;
  serviceId: string | null;
  type: MovementTypeEnum;
}
