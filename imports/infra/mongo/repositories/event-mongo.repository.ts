import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import {
  FindPaginatedEventsRequest,
  IEventRepository,
} from '@application/events/repositories/event.repository';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Event } from '@domain/events/models/event.model';
import { EventMongoCollection } from '@infra/mongo/collections/event.collection';
import { EventEntity } from '@infra/mongo/entities/event.entity';
import { EventMapper } from '@infra/mongo/mappers/event.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';

@injectable()
export class EventMongoRepository
  extends CrudMongoRepository<Event, EventEntity>
  implements IEventRepository
{
  public constructor(
    @inject(DIToken.ILoggerService)
    protected readonly logger: ILoggerService,
    protected readonly collection: EventMongoCollection,
    protected readonly mapper: EventMapper,
  ) {
    super(collection, mapper, logger);
  }

  public findPaginated(
    request: FindPaginatedEventsRequest,
  ): Promise<FindPaginatedResponse<Event>> {
    const query: Mongo.Query<EventEntity> = {
      isDeleted: false,
    };

    if (request.filterByCreatedAt.length > 0) {
      query.createdAt = {
        $gte: new DateVo(request.filterByCreatedAt[0]).date,
        $lte: new DateVo(request.filterByCreatedAt[1]).date,
      };
    }

    if (request.filterByResource.length > 0) {
      query.resource = { $in: request.filterByResource };
    }

    if (request.filterByAction.length > 0) {
      query.action = { $in: request.filterByAction };
    }

    const pipeline: Document[] = [
      { $match: query },
      ...this.getPaginatedPipeline(request),
    ];

    return super.paginate(pipeline, query);
  }
}
