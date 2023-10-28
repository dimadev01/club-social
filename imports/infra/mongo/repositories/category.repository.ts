import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ILogger } from '@application/logger/logger.interface';
import { CategoryEnum } from '@domain/categories/category.enum';
import { ICategoryPort } from '@domain/categories/category.port';
import { Category } from '@domain/categories/entities/category.entity';
import { DIToken } from '@infra/di/di-tokens';
import { CategoriesCollection } from '@infra/mongo/collections/categories.collection';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoRepository } from '@infra/mongo/common/mongo.repository';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

@injectable()
export class CategoryRepository
  extends MongoRepository<Category>
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

  public async findByCode(code: CategoryEnum): Promise<Category | undefined> {
    return this.getCollection().findOneAsync({ code });
  }

  public async findByCodeOrThrow(code: CategoryEnum): Promise<Category> {
    const category = await this.findByCode(code);

    if (!category) {
      throw new EntityNotFoundError(Category);
    }

    return category;
  }

  public async findPaginated(
    request: PaginatedRequestDto
  ): Promise<PaginatedResponse<Category>> {
    const query: Mongo.Query<Category> = {
      isDeleted: false,
    };

    const options = this.createPaginatedQueryOptions(
      request.page,
      request.pageSize
    );

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
}
