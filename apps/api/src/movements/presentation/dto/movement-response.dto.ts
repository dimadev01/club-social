import {
  MovementCategory,
  MovementDto,
  MovementMode,
  MovementStatus,
} from '@club-social/shared/movements';

export class MovementResponseDto implements MovementDto {
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
  public updatedAt: string;
  public updatedBy?: null | string;
  public voidedAt: null | string;
  public voidedBy: null | string;
  public voidReason: null | string;
}
