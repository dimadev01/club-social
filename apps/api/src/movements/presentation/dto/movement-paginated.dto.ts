import {
  MovementCategory,
  MovementMode,
  MovementPaginatedDto,
  MovementPaginatedExtraDto,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';

export class MovementPaginatedExtraResponseDto implements MovementPaginatedExtraDto {
  public totalAmount: number;
  public totalAmountInflow: number;
  public totalAmountOutflow: number;
}

export class MovementPaginatedResponseDto implements MovementPaginatedDto {
  public amount: number;
  public category: MovementCategory;
  public createdAt: string;
  public date: string;
  public id: string;
  public mode: MovementMode;
  public notes: null | string;
  public paymentId: null | string;
  public status: MovementStatus;
  public type: MovementType;
}
