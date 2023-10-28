import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';

export interface CreateMovement {
  amount: number;
  category: CategoryEnum;
  date: string;
  employeeId: string | null;
  memberId: string | null;
  notes: string | null;
  professorId: string | null;
  serviceId: string | null;
  type: CategoryTypeEnum;
}

export interface CreateMovementMember {
  _id: string;
  firstName: string;
  lastName: string;
}
