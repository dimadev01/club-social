import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { FindPaginatedResponseNewV } from '@domain/common/repositories/queryable-grid-repository.interface';
import { DIToken } from '@domain/common/tokens.di';
import { PaymentModel } from '@domain/payments/models/payment.model';
import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/find-paginated-payments.interface';
import { IPaymentRepository } from '@domain/payments/repositories/payment-repository.interface';
import { PaymentMapper } from '@infra/mappers/payment.mapper';
import { PaymentAuditableCollection } from '@infra/mongo/collections/payment-auditable.collection';
import { PaymentCollection } from '@infra/mongo/collections/payment.collection';
import { PaymentAuditEntity } from '@infra/mongo/entities/payments/payment-audit.entity';
import { PaymentEntity } from '@infra/mongo/entities/payments/payment.entity';
import { CrudMongoAuditableRepository } from '@infra/mongo/repositories/common/crud-mongo-auditable.repository';

@injectable()
export class PaymentMongoRepository
  extends CrudMongoAuditableRepository<
    PaymentModel,
    PaymentEntity,
    PaymentAuditEntity
  >
  implements IPaymentRepository
{
  public constructor(
    @inject(PaymentCollection)
    protected readonly collection: PaymentCollection,
    @inject(PaymentAuditableCollection)
    protected readonly auditableCollection: PaymentAuditableCollection,
    @inject(PaymentMapper)
    protected readonly mapper: PaymentMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async findPaginated(
    request: FindPaginatedPaymentsRequest,
  ): Promise<FindPaginatedResponseNewV<PaymentModel>> {
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

    if (request.filterByMember) {
      $match.$expr.$and.push({
        $in: ['$memberId', request.filterByMember],
      });
    }

    const entitiesPipeline: Document[] = [];

    entitiesPipeline.push(
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
    );

    return super.findPaginatedPipeline(pipeline, entitiesPipeline);
  }
}
