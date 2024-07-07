import { ICrudRepository } from '@application/common/repositories/crud.repository';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
  IGridRepository,
} from '@application/common/repositories/grid.repository';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { MemberCategoryEnum } from '@domain/members/member.enum';
import { Price } from '@domain/prices/models/price.model';

export interface IPriceRepository
  extends ICrudRepository<Price>,
    IGridRepository<Price, FindPaginatedPricesRequest> {
  findOneCategory(
    dueCategory: DueCategoryEnum,
    memberCategory: MemberCategoryEnum,
  ): Promise<Price | null>;
}

export interface FindPaginatedPricesRequest
  extends FindPaginatedPricesFilters,
    FindPaginatedRequest {}

export interface FindPaginatedPricesFilters {
  filterByDueCategory: DueCategoryEnum[];
  filterByMemberCategory: MemberCategoryEnum[];
}

export type FindPaginatedPricesResponse = FindPaginatedResponse<Price>;
