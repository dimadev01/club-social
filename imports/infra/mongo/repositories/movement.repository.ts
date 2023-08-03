import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';
import { PaginatedRequestDto } from '@application/common/paginated-request.dto';
import { PaginatedResponse } from '@application/common/paginated-response.dto';
import { ILogger } from '@application/logger/logger.interface';
import { Movement } from '@domain/movements/movement.entity';
import { IMovementPort } from '@domain/movements/movement.port';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { Tokens } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoRepository } from '@infra/mongo/common/mongo.repository';

@injectable()
export class MovementRepository
  extends MongoRepository<Movement>
  implements IMovementPort
{
  // #region Constructors (1)

  public constructor(
    @inject(Tokens.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  // #endregion Constructors (1)

  // #region Public Methods (2)

  public async findAll(): Promise<Movement[]> {
    return this.getCollection().find().fetchAsync();
  }

  public async findPaginated(
    request: PaginatedRequestDto
  ): Promise<PaginatedResponse<Movement>> {
    const query: Mongo.Query<Movement> = {
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

  // #endregion Public Methods (2)

  // #region Protected Methods (2)

  protected getCollection(): MongoCollection<Movement> {
    return MovementsCollection;
  }

  // #endregion Protected Methods (2)
}
