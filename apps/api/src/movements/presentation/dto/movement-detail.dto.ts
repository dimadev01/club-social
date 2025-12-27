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
  public id: string;
  public mode: MovementMode;
  public notes: null | string;
  public paymentId: null | string;
  public status: MovementStatus;
  public type: MovementType;
  public updatedAt: string;
  public updatedBy?: null | string;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}
