import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';

export class GetMovementResponseDto {
  public _id: string;

  public amount: number;

  public amountFormatted: string;

  public category: CategoryEnum;

  public date: string;

  public employeeId: string | null;

  public memberId: string | null;

  public notes: string | null;

  public professorId: string | null;

  public serviceId: string | null;

  public type: CategoryTypeEnum;
}
