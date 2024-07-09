import { ICrudRepository } from '@application/common/repositories/crud.repository';
import { PriceCategory } from '@domain/prices/models/price-category.model';

export interface IPriceCategoryRepository
  extends ICrudRepository<PriceCategory> {
  findByPrice(priceId: string): Promise<PriceCategory[]>;
}
