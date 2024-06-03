import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { GetPaymentRequest } from '@application/payments/use-cases/get-payment/get-payment.request';
import { GetPaymentResponse } from '@application/payments/use-cases/get-payment/get-payment.response';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';
import { PaymentDue } from '@domain/payments/models/payment-due.model';
import { IPaymentDueRepository } from '@domain/payments/repositories/payment-due.repository';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

@injectable()
export class GetPaymentUseCase
  implements IUseCase<GetPaymentRequest, GetPaymentResponse>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    @inject(DIToken.IPaymentDueRepository)
    private readonly _paymentDueRepository: IPaymentDueRepository,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    private readonly _getMember: GetMemberUseCase,
  ) {}

  public async execute(
    request: FindOneModelByIdRequest,
  ): Promise<Result<GetPaymentResponse, Error>> {
    const payment = await this._paymentRepository.findOneById(request);

    if (!payment) {
      return err(new ModelNotFoundError());
    }

    payment.dues = await this._paymentDueRepository.findByPayment(payment._id);

    const dues = await this._dueRepository.findByIds({
      ids: payment.dues.map((paymentDue) => paymentDue.dueId),
    });

    payment.dues = payment.dues.map((paymentDue) => {
      const due = dues.find((d) => d._id === paymentDue.dueId);

      return new PaymentDue(paymentDue, due);
    });

    const member = await this._getMember.execute({ id: payment.memberId });

    if (member.isErr()) {
      return err(member.error);
    }

    invariant(member.value);

    return ok<GetPaymentResponse>({
      date: payment.date.toISOString(),
      dues: payment.dues.map((paymentDue) => {
        const due = dues.find((d) => d._id === paymentDue.dueId);

        invariant(due);

        return {
          amount: paymentDue.amount.amount,
          due: {
            amount: due.amount.amount,
            category: due.category,
            date: due.date.toISOString(),
            id: due._id,
            member: undefined,
            memberId: due.memberId,
            notes: due.notes,
            paymentId: payment._id,
            status: due.status,
          },
          dueId: paymentDue.dueId,
        };
      }),
      id: payment._id,
      member: member.value,
      memberId: payment.memberId,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
    });
  }
}
