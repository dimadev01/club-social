import { PaginatedResponse } from '@application/common/paginated-response.dto';
import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';

export class GetMovementsGridResponseDto extends PaginatedResponse<MovementGridDto> {
  expense: number;

  income: number;

  debt: number;

  balance: number;
}
