import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';
import { PaginatedRequestDto } from '@application/common/paginated-request.dto';
import { PaginatedResponse } from '@application/common/paginated-response.dto';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ILogger } from '@application/logger/logger.interface';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { Category } from '@domain/categories/category.entity';
import { ICategoryPort } from '@domain/categories/category.port';
import { Tokens } from '@infra/di/di-tokens';
import { CategoriesCollection } from '@infra/mongo/collections/categories.collection';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoRepository } from '@infra/mongo/common/mongo.repository';

@injectable()
export class CategoryRepository
  extends MongoRepository<Category>
  implements ICategoryPort
{
  // #region Constructors (1)

  public constructor(
    @inject(Tokens.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  async findPaginated(
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

  // #endregion Constructors (1)

  // #region Public Methods (3)

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

  // #endregion Public Methods (3)

  // #region Protected Methods (2)

  protected getCollection(): MongoCollection<Category> {
    return CategoriesCollection;
  }

  protected getLogger(): ILogger {
    return this._logger;
  }

  // #endregion Protected Methods (2)
}
