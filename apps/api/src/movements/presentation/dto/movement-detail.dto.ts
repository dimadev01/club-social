import {
  IMovementDetailDto,
  MovementCategory,
  MovementMode,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';

export class MovementDetailDto implements IMovementDetailDto {
  public amount: number;
  public category: MovementCategory;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public description: null | string;
  public id: string;
  public mode: MovementMode;
  public paymentId: null | string;
  public status: MovementStatus;
  public type: MovementType;
  public updatedAt: string;
  public updatedBy: string;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}
