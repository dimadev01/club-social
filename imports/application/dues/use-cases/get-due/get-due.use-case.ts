import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetDueRequest } from '@application/dues/use-cases/get-due/get-due.request';
import { GetDueResponse } from '@application/dues/use-cases/get-due/get-due.response';
import { GetMemberUseCase } from '@application/members/use-cases/get-member/get-member.use.case';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';
import { IPaymentDueRepository } from '@domain/payments/repositories/payment-due.repository';

@injectable()
export class GetDueUseCase implements IUseCase<GetDueRequest, GetDueResponse> {
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IPaymentDueRepository)
    private readonly _paymentDueRepository: IPaymentDueRepository,
    private readonly _getMemberUseCase: GetMemberUseCase,
  ) {}

  public async execute(
    request: GetDueRequest,
  ): Promise<Result<GetDueResponse, Error>> {
    const due = await this._dueRepository.findOneById(request);

    if (!due) {
      return err(new ModelNotFoundError());
    }

    const paymentDue = await this._paymentDueRepository.findOneByDue(due._id);

    const member = await this._getMemberUseCase.execute({ id: due.memberId });

    if (member.isErr()) {
      return err(member.error);
    }

    invariant(member.value);

    return ok<GetDueResponse>({
      amount: due.amount.amount,
      category: due.category,
      date: due.date.toISOString(),
      id: due._id,
      member: member.value,
      memberId: due.memberId,
      notes: due.notes,
      paymentId: paymentDue?.paymentId,
      status: due.status,
    });
  }
}
