import { ICrudRepository } from '@application/common/repositories/crud.repository';
import { PriceCategory } from '@domain/prices/models/price-category.model';

export type IPriceCategoryRepository = ICrudRepository<PriceCategory>;
