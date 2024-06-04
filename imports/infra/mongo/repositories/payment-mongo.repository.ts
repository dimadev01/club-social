import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { Payment } from '@domain/payments/models/payment.model';
import {
  FindOnePaymentById,
  FindPaginatedPaymentsRequest,
  IPaymentRepository,
} from '@domain/payments/payment.repository';
import { PaymentAuditableCollection } from '@infra/mongo/collections/payment-auditable.collection';
import { PaymentCollection } from '@infra/mongo/collections/payment.collection';
import { PaymentAuditEntity } from '@infra/mongo/entities/payment-audit.entity';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';
import { PaymentMapper } from '@infra/mongo/mappers/payment.mapper';
import { CrudMongoAuditableRepository } from '@infra/mongo/repositories/common/crud-mongo-auditable.repository';
import { MemberMongoRepository } from '@infra/mongo/repositories/member-mongo.repository';
import { PaymentDueMongoRepository } from '@infra/mongo/repositories/payment-due-mongo.repository';

@injectable()
export class PaymentMongoRepository
  extends CrudMongoAuditableRepository<
    Payment,
    PaymentEntity,
    PaymentAuditEntity
  >
  implements IPaymentRepository
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    protected readonly collection: PaymentCollection,
    protected readonly auditableCollection: PaymentAuditableCollection,
    protected readonly mapper: PaymentMapper,
    private readonly _memberRepository: MemberMongoRepository,
    private readonly _paymentDueRepository: PaymentDueMongoRepository,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async findOneByReceipt(
    receiptNumber: number,
  ): Promise<Payment | null> {
    const entity = await this.collection.findOneAsync({
      isDeleted: false,
      receiptNumber,
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  public async findOneById(
    request: FindOnePaymentById,
  ): Promise<Payment | null> {
    const payment = await super.findOneById(request);

    if (!payment) {
      return null;
    }

    if (request.fetchMember ?? true) {
      payment.member = await this._memberRepository.findOneByIdOrThrow({
        id: payment.memberId,
      });
    }

    if (request.fetchPaymentDues) {
      payment.paymentDues = await this._paymentDueRepository.findByPayment({
        paymentId: payment._id,
      });
    }

    return payment;
  }

  public async findPaginated(
    request: FindPaginatedPaymentsRequest,
  ): Promise<FindPaginatedResponse<Payment>> {
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
          pipeline: [
            {
              $lookup: {
                as: 'due',
                foreignField: '_id',
                from: 'dues',
                localField: 'dueId',
              },
            },
            {
              $unwind: '$due',
            },
          ],
        },
      },
    );

    return super.findPaginatedPipeline(pipeline, entitiesPipeline);
  }
}
