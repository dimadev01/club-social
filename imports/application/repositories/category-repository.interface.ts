import { IRepository } from '@application/repositories/repository.base';
import { Category } from '@domain/entities/category.entity';
import { CategoryEnum } from '@domain/enums/categories.enum';

export interface ICategoryRepository extends IRepository<Category> {
  findAll(): Promise<Category[]>;
  findByCode(code: CategoryEnum): Promise<Category | undefined>;
  findByCodeOrThrow(code: CategoryEnum): Promise<Category>;
}
