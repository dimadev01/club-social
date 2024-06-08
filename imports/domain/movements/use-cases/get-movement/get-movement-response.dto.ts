import {
  MovementCategoryEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';

export class GetMovementResponseDto {
  public _id: string;

  public amount: number;

  public amountFormatted: string;

  public category: MovementCategoryEnum;

  public date: string;

  public employeeId: string | null;

  public memberId: string | null;

  public notes: string | null;

  public professorId: string | null;

  public serviceId: string | null;

  public type: MovementTypeEnum;
}
