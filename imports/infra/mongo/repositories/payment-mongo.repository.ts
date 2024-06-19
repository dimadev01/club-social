import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerRepository } from '@application/common/logger/logger.interface';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import {
  FindPaginatedPaymentsFilters,
  FindPaginatedPaymentsRequest,
  GetPaymentsTotalsResponse,
  IPaymentRepository,
} from '@application/payments/repositories/payment.repository';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { Payment } from '@domain/payments/models/payment.model';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import { PaymentAuditableCollection } from '@infra/mongo/collections/payment-auditable.collection';
import { PaymentMongoCollection } from '@infra/mongo/collections/payment.collection';
import { PaymentAuditEntity } from '@infra/mongo/entities/payment-audit.entity';
import { PaymentEntity } from '@infra/mongo/entities/payment.entity';
import { PaymentMapper } from '@infra/mongo/mappers/payment.mapper';
import { CrudMongoAuditableRepository } from '@infra/mongo/repositories/common/crud-mongo-auditable.repository';
import { MemberMongoRepository } from '@infra/mongo/repositories/member-mongo.repository';

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
    protected readonly logger: ILoggerRepository,
    protected readonly collection: PaymentMongoCollection,
    protected readonly auditableCollection: PaymentAuditableCollection,
    protected readonly mapper: PaymentMapper,
    private readonly _memberRepository: MemberMongoRepository,
  ) {
    super(collection, mapper, logger, auditableCollection);
  }

  public async findOneById(request: FindOneById): Promise<Payment | null> {
    const payment = await super.findOneById(request);

    if (!payment) {
      return null;
    }

    payment.member = await this._memberRepository.findOneByIdOrThrow({
      id: payment.memberId,
    });

    return payment;
  }

  public async findOneByReceipt(
    receiptNumber: number,
  ): Promise<Payment | null> {
    const entity = await this.collection.findOneAsync({
      isDeleted: false,
      receiptNumber,
      status: PaymentStatusEnum.PAID,
    });

    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  public async findPaginated(
    request: FindPaginatedPaymentsRequest,
  ): Promise<FindPaginatedResponse<Payment>> {
    const query = this._getQueryByFilters(request);

    const pipeline: Document[] = [
      { $match: query },
      ...this.getPaginatedPipeline(request),
      ...this.getMemberLookupPipeline(),
    ];

    return super.paginate(pipeline, query);
  }

  private _getQueryByFilters(
    request: FindPaginatedPaymentsFilters,
  ): Mongo.Query<PaymentEntity> {
    const query: Mongo.Query<PaymentEntity> = {
      isDeleted: false,
    };

    if (request.filterByMember.length > 0) {
      query.memberId = { $in: request.filterByMember };
    }

    if (request.filterByStatus.length > 0) {
      query.status = { $in: request.filterByStatus as PaymentStatusEnum[] };
    }

    if (request.filterByCreatedAt.length > 0) {
      query.createdAt = {
        $gte: new DateVo(request.filterByCreatedAt[0]).date,
        $lte: new DateVo(request.filterByCreatedAt[1]).date,
      };
    }

    if (request.filterByDate.length > 0) {
      query.date = {
        $gte: new DateVo(request.filterByDate[0]).date,
        $lte: new DateVo(request.filterByDate[1]).date,
      };
    }

    return query;
  }

  public async getTotals(
    request: FindPaginatedPaymentsFilters,
  ): Promise<GetPaymentsTotalsResponse> {
    const query = this._getQueryByFilters(request);

    const getGroupCategory = (category: DueCategoryEnum) => ({
      [category]: {
        $sum: {
          $cond: [{ $eq: ['$_id', category] }, '$amount', 0],
        },
      },
    });

    const [result] = await this.collection
      .rawCollection()
      .aggregate([
        { $match: query },
        { $unwind: '$dues' },
        {
          $group: {
            _id: '$dues.dueCategory',
            amount: { $sum: '$dues.totalAmount' },
          },
        },
        {
          $group: {
            _id: null,
            ...getGroupCategory(DueCategoryEnum.ELECTRICITY),
            ...getGroupCategory(DueCategoryEnum.MEMBERSHIP),
            ...getGroupCategory(DueCategoryEnum.GUEST),
            total: { $sum: '$amount' },
          },
        },
        { $project: { _id: 0 } },
      ])
      .toArray();

    return {
      electricity: result?.electricity ?? 0,
      guest: result?.guest ?? 0,
      membership: result?.membership ?? 0,
      total: result?.total ?? 0,
    };
  }
}
