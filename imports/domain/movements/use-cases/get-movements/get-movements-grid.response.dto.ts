import { MovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';

export class GetMovementsGridResponseDto extends PaginatedResponse<MovementGridDto> {
  balance: number;

  income: number;

  outcome: number;

  $explain: any;
}
