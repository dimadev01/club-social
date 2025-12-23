import { IMovementPaginatedExtraDto } from '@club-social/shared/movements';

export class MovementPaginatedExtraDto implements IMovementPaginatedExtraDto {
  public totalAmount: number;
  public totalAmountInflow: number;
  public totalAmountOutflow: number;
}
