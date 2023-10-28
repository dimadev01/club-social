import { ICrudPort } from '@application/repositories/crud.port';
import { IPaginatedRepository } from '@application/repositories/repository-paginated.interface';
import { CategoryEnum } from '@domain/categories/category.enum';
import { Category } from '@domain/categories/entities/category.entity';

export interface ICategoryPort
  extends ICrudPort<Category>,
    IPaginatedRepository<Category> {
  findAll(): Promise<Category[]>;
  findByCode(code: CategoryEnum): Promise<Category | undefined>;
  findByCodeOrThrow(code: CategoryEnum): Promise<Category>;
}
