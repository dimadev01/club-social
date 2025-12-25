import {
  IMovementPaginatedDto,
  IMovementPaginatedExtraDto,
  MovementCategory,
  MovementMode,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';

export class MovementPaginatedDto implements IMovementPaginatedDto {
  public amount: number;
  public category: MovementCategory;
  public createdAt: string;
  public date: string;
  public description: null | string;
  public id: string;
  public mode: MovementMode;
  public paymentId: null | string;
  public status: MovementStatus;
  public type: MovementType;
}

export class MovementPaginatedExtraDto implements IMovementPaginatedExtraDto {
  public totalAmount: number;
  public totalAmountInflow: number;
  public totalAmountOutflow: number;
}
