import { CategoryGridDto } from '@domain/categories/use-cases/get-categories-grid/category-grid.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class GetCategoriesGridResponseDto extends PaginatedResponse<CategoryGridDto> {}
