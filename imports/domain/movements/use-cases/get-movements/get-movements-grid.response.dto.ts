import { OldMovementGridDto } from '@domain/movements/use-cases/get-movements/get-movements-grid.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class OldGetMovementsGridResponseDto extends PaginatedResponse<OldMovementGridDto> {
  expense: number;

  income: number;

  debt: number;

  balance: number;
}
