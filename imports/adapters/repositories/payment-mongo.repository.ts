import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/find-paginated-payments.interface';
import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { PaymentMapper } from '@adapters/mappers/payment.mapper';
import { PaymentAuditableCollection } from '@adapters/mongo/collections/payment-auditable.collection';
import { PaymentCollection } from '@adapters/mongo/collections/payment.collection';
import { PaymentAuditEntity } from '@adapters/mongo/entities/payment-audit.entity';
import { PaymentEntity } from '@adapters/mongo/entities/payment.entity';
import { CrudMongoAuditableRepository } from '@adapters/repositories/crud-mongo-auditable.repository';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { DIToken } from '@domain/common/tokens.di';
import { PaymentModel } from '@domain/payments/models/payment.model';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

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
    protected readonly collection: PaymentCollection,
    protected readonly auditableCollection: PaymentAuditableCollection,
    protected readonly mapper: PaymentMapper,
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async findOneByReceipt(
    receiptNumber: number,
  ): Promise<PaymentModel | null> {
    const entity = await this.collection.findOneAsync({
      isDeleted: false,
      receiptNumber,
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toModel(entity);
  }

  public async findPaginated(
    request: FindPaginatedPaymentsRequest,
  ): Promise<FindPaginatedResponse<PaymentModel>> {
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
      {
        $lookup: {
          as: 'dues',
          foreignField: 'paymentId',
          from: 'payment.dues',
          localField: '_id',
        },
      },
    );

    return super.findPaginatedPipeline(pipeline, entitiesPipeline);
  }
}
