import { plainToInstance } from 'class-transformer';
import { Mongo } from 'meteor/mongo';
import { inject, injectable } from 'tsyringe';

import { PaymentCollectionOld } from '@adapters/mongo/collections/payment.collection.old';
import { MongoCollectionOld } from '@adapters/mongo/common/mongo-collection.old';
import { MongoCrudRepositoryOld } from '@adapters/repositories/mongo-crud.repository';
import {
  FindByReceiptNumberRequest,
  FindPaginatedPaymentsAggregationResult,
  FindPaginatedPaymentsRequest,
  FindPaginatedPaymentsResponse,
} from '@adapters/repositories/payments/payment-repository.types';
import { ILogger } from '@domain/common/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { PaymentOld } from '@domain/payments/entities/payment.entity';
import { IPaymentPort } from '@domain/payments/payment.port';
import { DateUtils } from '@shared/utils/date.utils';
import { MongoUtilsOld } from '@shared/utils/mongo.utils';

@injectable()
export class PaymentRepository
  extends MongoCrudRepositoryOld<PaymentOld>
  implements IPaymentPort
{
  public constructor(
    @inject(DIToken.Logger)
    protected readonly _logger: ILogger,
  ) {
    super(_logger);
  }

  public async findLastByReceiptNumber(): Promise<PaymentOld | null> {
    return (
      (await this.getCollection().findOneAsync(
        { isDeleted: false },
        { sort: { createdAt: -1, receiptNumber: -1 } },
      )) ?? null
    );
  }

  public async findOneByReceiptNumber(
    request: FindByReceiptNumberRequest,
  ): Promise<PaymentOld | null> {
    return (
      (await this.getCollection().findOneAsync({
        isDeleted: false,
        receiptNumber: request.receiptNumber,
      })) ?? null
    );
  }

  public async findPaginated(
    request: FindPaginatedPaymentsRequest,
  ): Promise<FindPaginatedPaymentsResponse> {
    const query: Mongo.Selector<PaymentOld> = {
      $expr: { $and: [{ $eq: ['$isDeleted', request.showDeleted ?? false] }] },
    };

    if (request.from && request.to) {
      query.$expr.$and.push({
        $gte: ['$date', DateUtils.utc(request.from).startOf('day').toDate()],
      });

      query.$expr.$and.push({
        $lte: ['$date', DateUtils.utc(request.to).startOf('day').toDate()],
      });
    }

    if (request.memberIds.length > 0) {
      query.$expr.$and.push({ $in: ['$member._id', request.memberIds] });
    }

    const $facet: Record<string, unknown> = {
      data: [
        {
          $sort: {
            [request.sortField]: this._getSorterValue(request.sortOrder),
            receiptNumber: -1,
          },
        },
        { $skip: (request.page - 1) * request.pageSize },
        { $limit: request.pageSize },
      ],
      total: [{ $count: 'count' }],
      totalAmount: [
        { $group: { _id: null, sum: { $sum: { $sum: '$dues.amount' } } } },
      ],
    };

    const $project: Record<string, number | object> = {
      data: 1,
      totalAmount: MongoUtilsOld.first('$totalAmount.sum', 0),
    };

    const hasFilters = query.$expr.$and.length > 1;

    if (hasFilters) {
      $facet.total = [{ $count: 'count' }];

      $project.count = MongoUtilsOld.first('$total.count', 0);
    }

    const [result] = await this.getCollection()
      .rawCollection()
      .aggregate<FindPaginatedPaymentsAggregationResult>([
        { $match: query },
        { $facet },
        { $project },
      ])
      .toArray();

    return {
      count: await this.getAggregationCount(hasFilters, result.count),
      data: result.data.map((item) => plainToInstance(PaymentOld, item)),
      totalAmount: result.totalAmount,
    };
  }

  protected getCollection(): MongoCollectionOld<PaymentOld> {
    return PaymentCollectionOld;
  }
}
