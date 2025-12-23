import { IMovementPaginatedSummaryDto } from '@club-social/shared/movements';

export class MovementPaginatedSummaryDto implements IMovementPaginatedSummaryDto {
  public totalAmount: number;
  public totalAmountInflow: number;
  public totalAmountOutflow: number;
}
