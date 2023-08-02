import { IRepository } from '@application/repositories/repository.base';
import { Category } from '@domain/entities/category.entity';

export interface ICategoryRepository extends IRepository<Category> {
  findAll(): Promise<Category[]>;
}
