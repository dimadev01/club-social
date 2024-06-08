import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export interface CreateMovement {
  amount: number;
  category: MovementCategoryEnum;
  date: string;
  employeeId: string | null;
  memberId: string | null;
  notes: string | null;
  professorId: string | null;
  serviceId: string | null;
  type: MovementTypeEnum;
}

export interface CreateMovementMember {
  _id: string;
  firstName: string;
  lastName: string;
}
