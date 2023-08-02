import { inject, injectable } from 'tsyringe';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ILogger } from '@application/logger/logger.interface';
import { ICategoryRepository } from '@application/repositories/category-repository.interface';
import { Category } from '@domain/entities/category.entity';
import { CategoryEnum } from '@domain/enums/categories.enum';
import { Tokens } from '@infra/di/di-tokens';
import { CategoriesCollection } from '@infra/mongo/collections/categories.collection';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoRepository } from '@infra/mongo/common/mongo.repository';

@injectable()
export class CategoryRepository
  extends MongoRepository<Category>
  implements ICategoryRepository
{
  // #region Constructors (1)

  public constructor(
    @inject(Tokens.Logger)
    private _logger: ILogger
  ) {
    super();
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
