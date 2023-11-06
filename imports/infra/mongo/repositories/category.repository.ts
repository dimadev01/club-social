import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { Category } from '@domain/categories/entities/category.entity';
import { DIToken } from '@infra/di/di-tokens';
import {
  CategoriesCollection,
  CategoriesSchema,
} from '@infra/mongo/collections/category.collection';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

@injectable()
export class CategoryRepository
  extends MongoCrudRepository<Category>
  implements ICategoryPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  public async findAll(): Promise<Category[]> {
    return this.getCollection().find().fetchAsync();
  }

  public async findPaginated(
    request: PaginatedRequestDto
  ): Promise<PaginatedResponse<Category>> {
    const query: Mongo.Query<Category> = {
      isDeleted: false,
    };

    const options = this.createPaginatedQueryOptionsNew(request);

    return {
      count: await this.getCollection().find(query).countAsync(),
      data: await this.getCollection().find(query, options).fetchAsync(),
    };
  }

  protected getCollection(): MongoCollection<Category> {
    return CategoriesCollection;
  }

  protected getLogger(): ILogger {
    return this._logger;
  }

  protected getSchema(): SimpleSchema {
    return CategoriesSchema;
  }
}
