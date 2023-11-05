import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { CategoryEnum } from '@domain/categories/category.enum';
import { Category } from '@domain/categories/entities/category.entity';

export interface ICategoryPort
  extends ICrudPort<Category>,
    IPaginatedPort<Category> {
  findAll(): Promise<Category[]>;
  findByCode(code: CategoryEnum): Promise<Category | undefined>;
  findByCodeOrThrow(code: CategoryEnum): Promise<Category>;
}
