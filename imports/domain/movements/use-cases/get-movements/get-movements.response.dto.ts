import { MovementGridDto } from '@domain/movements/use-cases/get-movements/movement-grid.dto';
import { PaginatedResponse } from '@kernel/paginated-response.dto';

export class GetMovementsResponseDto extends PaginatedResponse<MovementGridDto> {}
