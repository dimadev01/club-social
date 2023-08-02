import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { ICategoryRepository } from '@application/repositories/category-repository.interface';
import { Category } from '@domain/entities/category.entity';
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
    return CategoriesCollection.rawCollection()
      .aggregate<Category>([
        {
          $lookup: {
            as: 'movements',
            foreignField: 'category',
            from: 'movements',
            localField: 'code',
          },
        },
      ])
      .toArray();
  }

  public getCollection(): MongoCollection<Category> {
    return CategoriesCollection;
  }

  public getLogger(): ILogger {
    return this._logger;
  }

  // #endregion Public Methods (3)
}
