import { PaginatedResponse } from '@application/common/paginated-response.dto';
import { CategoryGridDto } from '@domain/categories/use-cases/get-categories-grid/category-grid.dto';

export class GetCategoriesGridResponseDto extends PaginatedResponse<CategoryGridDto> {}
