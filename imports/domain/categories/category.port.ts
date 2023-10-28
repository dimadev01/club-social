import { IPaginatedRepository } from '@application/repositories/repository-paginated.interface';
import { IRepository } from '@application/repositories/repository.interface';
import { CategoryEnum } from '@domain/categories/category.enum';
import { Category } from '@domain/categories/entities/category.entity';

export interface ICategoryPort
  extends IRepository<Category>,
    IPaginatedRepository<Category> {
  findAll(): Promise<Category[]>;
  findByCode(code: CategoryEnum): Promise<Category | undefined>;
  findByCodeOrThrow(code: CategoryEnum): Promise<Category>;
}
