import { IMovementDetailDto } from '@club-social/shared/movements';

export class MovementDetailDto implements IMovementDetailDto {
  public amount: number;
  public category: string;
  public createdAt: string;
  public createdBy: string;
  public date: string;
  public description: null | string;
  public id: string;
  public paymentId: null | string;
  public status: string;
  public type: string;
  public updatedAt: string;
  public updatedBy: string;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}
