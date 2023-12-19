import { DueGridDto } from '@domain/dues/use-cases/get-dues-grid/get-dues-grid.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class GetDuesGridResponseDto extends PaginatedResponse<DueGridDto> {}
