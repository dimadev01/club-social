import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';

import {
  CategoriesSchema,
  CategoryCollection,
} from '@adapters/mongo/collections/category.collection';
import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { MongoCrudRepositoryOld } from '@adapters/repositories/mongo-crud.repository';
import { ILogger } from '@application/logger/logger.interface';
import { CategoryTypeEnum } from '@domain/categories/category.enum';
import { ICategoryPort } from '@domain/categories/category.port';
import { Category } from '@domain/categories/entities/category.entity';
import { DIToken } from '@domain/common/tokens.di';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

@injectable()
export class CategoryRepository
  extends MongoCrudRepositoryOld<Category>
  implements ICategoryPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  findByAllByType(type: CategoryTypeEnum): Promise<Category[]> {
    return this.getCollection()
      .find({ type }, { sort: { name: 1 } })
      .fetchAsync();
  }

  public async findAll(): Promise<Category[]> {
    return this.getCollection()
      .find({}, { sort: { name: 1 } })
      .fetchAsync();
  }

  public async findPaginated(
    request: PaginatedRequestDto,
  ): Promise<PaginatedResponse<Category>> {
    const query: Mongo.Selector<Category> = {
      isDeleted: false,
    };

    const options = this.createPaginatedQueryOptionsNew(request);

    return {
      count: await this.getCollection().find(query).countAsync(),
      data: await this.getCollection().find(query, options).fetchAsync(),
    };
  }

  protected getCollection(): MongoCollectionOld<Category> {
    return CategoryCollection;
  }

  protected getLogger(): ILogger {
    return this._logger;
  }

  protected getSchema(): SimpleSchema {
    return CategoriesSchema;
  }
}
