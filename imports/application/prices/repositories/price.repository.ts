import { ICrudRepository } from '@application/common/repositories/crud.repository';
import { IGridRepository } from '@application/common/repositories/grid.repository';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { Price } from '@domain/prices/models/price.model';

export interface IPriceRepository
  extends ICrudRepository<Price>,
    IGridRepository<Price> {
  findOneByCategory(dueCategory: DueCategoryEnum): Promise<Price | null>;
}
