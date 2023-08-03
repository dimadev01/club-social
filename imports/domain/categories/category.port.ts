import { IPaginatedRepository } from '@application/repositories/repository-paginated.base';
import { IRepository } from '@application/repositories/repository.base';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { Category } from '@domain/categories/category.entity';

export interface ICategoryPort
  extends IRepository<Category>,
    IPaginatedRepository<Category> {
  findAll(): Promise<Category[]>;
  findByCode(code: CategoryEnum): Promise<Category | undefined>;
  findByCodeOrThrow(code: CategoryEnum): Promise<Category>;
}
