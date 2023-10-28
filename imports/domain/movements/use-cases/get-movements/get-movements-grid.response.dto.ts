import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class GetMovementsGridResponseDto extends PaginatedResponse<MovementGridDto> {
  expense: number;

  income: number;

  debt: number;

  balance: number;
}
