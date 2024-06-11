import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { DueStatusEnum } from '@domain/dues/due.enum';
import {
  FindPaginatedDuesFilters,
  FindPaginatedDuesRequest,
  FindPendingDues,
  GetDuesTotalsResponse,
  IDueRepository,
} from '@domain/dues/due.repository';
import { Due } from '@domain/dues/models/due.model';
import { DueCollection } from '@infra/mongo/collections/due.collection';
import { DueEntity } from '@infra/mongo/entities/due.entity';
import { DueMapper } from '@infra/mongo/mappers/due.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';
import { MemberMongoRepository } from '@infra/mongo/repositories/member-mongo.repository';

@injectable()
export class DueMongoRepository
  extends CrudMongoRepository<Due, DueEntity>
  implements IDueRepository
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    protected readonly collection: DueCollection,
    protected readonly mapper: DueMapper,
    private readonly _memberRepository: MemberMongoRepository,
  ) {
    super(collection, mapper, logger);
  }

  public async findOneById(request: FindOneById): Promise<Due | null> {
    const entity = await this.collection.findOneAsync({
      _id: request.id,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    const due = this.mapper.toDomain(entity);

    due.member = await this._memberRepository.findOneByIdOrThrow({
      id: due.memberId,
    });

    return due;
  }

  public async findOneByIdOrThrow(request: FindOneById): Promise<Due> {
    const due = await this.findOneById(request);

    if (!due) {
      throw new InternalServerError();
    }

    return due;
  }

  public async findPaginated(
    request: FindPaginatedDuesRequest,
  ): Promise<FindPaginatedResponse<Due>> {
    const query = this._getMatchQueryToGridOrExport(request);

    const pipeline: Document[] = [
      { $match: query },
      ...this.getPaginatedPipeline(request),
      ...this.getMemberLookupPipeline(),
    ];

    return super.paginate(pipeline, query);
  }

  public async findPending(request: FindPendingDues): Promise<Due[]> {
    const query: Mongo.Query<DueEntity> = {
      isDeleted: false,
      memberId: request.memberId,
      status: { $in: [DueStatusEnum.PENDING, DueStatusEnum.PARTIALLY_PAID] },
    };

    const entities = await this.collection.find(query).fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  public async findToExport(request: FindPaginatedDuesRequest): Promise<Due[]> {
    const query = this._getMatchQueryToGridOrExport(request);

    const pipeline: Document[] = [
      { $match: query },
      this.getPaginatedSorterStage(request.sorter),
      ...this.getMemberLookupPipeline(),
    ];

    const entities = await this.collection
      .rawCollection()
      .aggregate<DueEntity>(pipeline)
      .toArray();

    return entities.map<Due>((entity) => this.mapper.toDomain(entity));
  }

  public async getTotals(
    request: FindPaginatedDuesFilters,
  ): Promise<GetDuesTotalsResponse> {
    const query = this._getMatchQueryToGridOrExport(request);

    const [result] = await this.collection
      .rawCollection()
      .aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$totalPendingAmount' } } },
      ])
      .toArray();

    return {
      pendingAmount: result?.total ?? 0,
    };
  }

  private _getMatchQueryToGridOrExport(
    request: FindPaginatedDuesFilters,
  ): Mongo.Query<DueEntity> {
    const query: Mongo.Query<DueEntity> = {
      isDeleted: false,
    };

    if (request.filterByMember.length > 0) {
      query.memberId = { $in: request.filterByMember };
    }

    if (request.filterByStatus.length > 0) {
      query.status = { $in: request.filterByStatus };
    }

    if (request.filterByCategory.length > 0) {
      query.category = { $in: request.filterByCategory };
    }

    if (request.filterByCreatedAt.length > 0) {
      query.createdAt = {
        $gte: new DateUtcVo(request.filterByCreatedAt[0]).toDate(),
        $lte: new DateUtcVo(request.filterByCreatedAt[1]).toDate(),
      };
    }

    if (request.filterByDate.length > 0) {
      query.date = {
        $gte: new DateUtcVo(request.filterByDate[0]).toDate(),
        $lte: new DateUtcVo(request.filterByDate[1]).toDate(),
      };
    }

    return query;
  }
}
