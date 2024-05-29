import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/queryable-grid-repository.interface';
import { DIToken } from '@domain/common/tokens.di';
import {
  FindPaginatedMembersRequest,
  IMemberRepository,
} from '@domain/members/member-repository.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { MemberMapper } from '@infra/mappers/member.mapper';
import { UserMapper } from '@infra/mappers/user.mapper';
import { MemberCollection } from '@infra/mongo/collections/member.collection';
import { PaginatedAggregationResult } from '@infra/mongo/common/paginated-aggregation.interface';
import { MemberEntity } from '@infra/mongo/entities/members/member.entity';
import { MongoUtils } from '@infra/mongo/mongo.utils';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';
import { PaginatedMemberEntity } from '@infra/mongo/repositories/members/member-mongo-repository.types';

@injectable()
export class MemberMongoRepository
  extends CrudMongoRepository<MemberModel, MemberEntity>
  implements IMemberRepository
{
  public constructor(
    @inject(MemberCollection)
    protected readonly collection: MemberCollection,
    @inject(MemberMapper)
    protected readonly memberMapper: MemberMapper,
    @inject(UserMapper)
    protected readonly userMapper: UserMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, memberMapper, logger);
  }

  public async findByDocument(documentID: string): Promise<MemberModel | null> {
    const entity = await this.collection.findOneAsync({
      documentID,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    return this.memberMapper.toModel(entity);
  }

  public async findPaginated(
    request: FindPaginatedMembersRequest,
  ): Promise<FindPaginatedResponse<MemberModel>> {
    const $match: Document = {
      $expr: { $and: [{ $eq: ['$isDeleted', false] }] },
    };

    if (request.filters?.category) {
      $match.$expr.$and.push({ $in: ['$category', request.filters.category] });
    }

    if (request.sorter.name) {
      request.sorter['user.profile.firstName'] = request.sorter.name;

      delete request.sorter.name;
    }

    const [{ entities, totalCount }] = await this.collection
      .rawCollection()
      .aggregate<PaginatedAggregationResult<PaginatedMemberEntity>>([
        { $match },
        {
          $lookup: {
            as: 'user',
            foreignField: '_id',
            from: 'users',
            localField: 'userId',
            pipeline: [],
          },
        },
        {
          $unwind: '$user',
        },
        {
          $facet: {
            entities: [
              { $sort: this.getSorter(request.sorter) },
              { $skip: (request.page - 1) * request.limit },
              { $limit: request.limit },
              {
                $lookup: {
                  as: 'user',
                  foreignField: '_id',
                  from: 'users',
                  localField: 'userId',
                },
              },
              { $unwind: '$user' },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
        {
          $project: {
            entities: 1,
            totalCount: MongoUtils.first('$totalCount.count', 0),
          },
        },
      ])
      .toArray();

    const items = entities.map((entity) => {
      const model = this.memberMapper.toModel(entity);

      model.user = this.userMapper.toModel(entity.user);

      return model;
    });

    return { items, totalCount };
  }
}
