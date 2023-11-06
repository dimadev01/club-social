import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { Movement } from '@domain/movements/entities/movement.entity';
import { IMovementPort } from '@domain/movements/movement.port';
import {
  MovementsCollection,
  MovementsSchema,
} from '@domain/movements/movements.collection';
import { DIToken } from '@infra/di/di-tokens';
import { MongoCollection } from '@infra/mongo/common/mongo-collection.base';
import { MongoCrudRepository } from '@infra/mongo/common/mongo-crud.repository';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

@injectable()
export class MovementRepository
  extends MongoCrudRepository<Movement>
  implements IMovementPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger
  ) {
    super(_logger);
  }

  public async findAll(): Promise<Movement[]> {
    return this.getCollection().find().fetchAsync();
  }

  public async findPaginated(
    request: PaginatedRequestDto
  ): Promise<PaginatedResponse<Movement>> {
    const query: Mongo.Query<Movement> = {
      isDeleted: false,
    };

    const options = this.getPaginatedQuery(request.page, request.pageSize);

    return {
      count: await this.getCollection().find(query).countAsync(),
      data: await this.getCollection().find(query, options).fetchAsync(),
    };
  }

  protected getCollection(): MongoCollection<Movement> {
    return MovementsCollection;
  }

  protected getSchema(): SimpleSchema {
    return MovementsSchema;
  }
}
