import {
  IMovementPaginatedDto,
  MovementCategory,
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
  public paymentId: null | string;
  public status: MovementStatus;
  public type: MovementType;
}
