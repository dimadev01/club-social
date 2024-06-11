import { Mongo } from 'meteor/mongo';
import type { Document } from 'mongodb';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { Payment } from '@domain/payments/models/payment.model';
import { PaymentStatusEnum } from '@domain/payments/payment.enum';
import {
  FindPaginatedPaymentsFilters,
  FindPaginatedPaymentsRequest,
  GetPaymentsTotalsResponse,
  IPaymentRepository,
} from '@domain/payments/payment.repository';
import { PaymentAuditableCollection } from '@infra/mongo/collections/payment-auditable.collection';
import { PaymentCollection } from '@infra/mongo/collections/payment.collection';
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
    protected readonly logger: ILogger,
    protected readonly collection: PaymentCollection,
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
    const query = this._getQueryForGridOrTotals(request);

    const pipeline: Document[] = [
      { $match: query },
      ...this.getPaginatedPipeline(request),
      ...this.getMemberLookupPipeline(),
    ];

    return super.paginate(pipeline, query);
  }

  private _getQueryForGridOrTotals(
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

    return query;
  }

  public async getTotals(
    request: FindPaginatedPaymentsFilters,
  ): Promise<GetPaymentsTotalsResponse> {
    const query = this._getQueryForGridOrTotals(request);

    const [result] = await this.collection
      .rawCollection()
      .aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .toArray();

    return {
      amount: result?.total ?? 0,
    };
  }
}
