import { Category } from '@domain/categories/entities/category.entity';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';

export const CategoryHistoricalCollection = new MongoCollection(
  'category-audits',
  Category
);
