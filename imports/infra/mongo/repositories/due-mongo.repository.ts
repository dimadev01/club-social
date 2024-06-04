import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { DueStatusEnum } from '@domain/dues/due.enum';
import {
  FindOneDueById,
  FindPaginatedDuesRequest,
  FindPendingDuesRequest,
  IDueRepository,
} from '@domain/dues/due.repository';
import { Due } from '@domain/dues/models/due.model';
import { DueCollection } from '@infra/mongo/collections/due.collection';
import { DueEntity } from '@infra/mongo/entities/due.entity';
import { DueMapper } from '@infra/mongo/mappers/due.mapper';
import { CrudMongoRepository } from '@infra/mongo/repositories/common/crud-mongo.repository';
import { MemberMongoRepository } from '@infra/mongo/repositories/member-mongo.repository';
import { PaymentDueMongoRepository } from '@infra/mongo/repositories/payment-due-mongo.repository';

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
    private readonly _paymentDueRepository: PaymentDueMongoRepository,
  ) {
    super(collection, mapper, logger);
  }

  public async findOneByIdOrThrow(request: FindOneDueById): Promise<Due> {
    const due = await this.findOneById(request);

    if (!due) {
      throw new InternalServerError();
    }

    return due;
  }

  public async findOneById(request: FindOneDueById): Promise<Due | null> {
    const entity = await this.collection.findOneAsync({
      _id: request.id,
      isDeleted: false,
    });

    if (!entity) {
      return null;
    }

    const due = this.mapper.toDomain(entity);

    if (request.fetchMember ?? true) {
      due.member = await this._memberRepository.findOneByIdOrThrow({
        id: due.memberId,
      });
    }

    if (request.fetchPaymentDues) {
      due.paymentDues = await this._paymentDueRepository.findByDue({
        dueId: due._id,
      });
    }

    return due;
  }

  public async findPaginated(
    request: FindPaginatedDuesRequest,
  ): Promise<FindPaginatedResponse<Due>> {
    const pipeline: Document[] = [];

    const $match: Document = {
      $expr: {
        $and: [
          {
            $eq: ['$isDeleted', false],
          },
        ],
      },
    };

    pipeline.push({ $match });

    if (request.filterByMember.length > 0) {
      $match.$expr.$and.push({
        $in: ['$memberId', request.filterByMember],
      });
    }

    if (request.filterByStatus.length > 0) {
      $match.$expr.$and.push({
        $in: ['$status', request.filterByStatus],
      });
    }

    const entitiesPipeline: Document[] = [
      ...this.getPaginatedPipeline(request),
      {
        $lookup: {
          as: 'member',
          foreignField: '_id',
          from: 'members',
          localField: 'memberId',
          pipeline: [
            {
              $lookup: {
                as: 'user',
                foreignField: '_id',
                from: 'users',
                localField: 'userId',
              },
            },
            {
              $unwind: '$user',
            },
          ],
        },
      },
      {
        $unwind: '$member',
      },
    ];

    return super.findPaginatedPipeline(pipeline, entitiesPipeline);
  }

  public async findPending(request: FindPendingDuesRequest): Promise<Due[]> {
    const query: Mongo.Query<DueEntity> = {
      isDeleted: false,
      memberId: request.memberId,
      status: DueStatusEnum.PENDING,
    };

    const entities = await this.collection.find(query).fetchAsync();

    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
