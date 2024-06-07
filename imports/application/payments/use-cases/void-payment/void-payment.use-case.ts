import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { VoidPaymentRequest } from '@application/payments/use-cases/void-payment/void-payment.request';
import { BaseError } from '@domain/common/errors/base.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';
import { IMemberCreditRepository } from '@domain/members/member-credit.repository';
import { IPaymentRepository } from '@domain/payments/payment.repository';

@injectable()
export class VoidPaymentUseCase implements IUseCase<VoidPaymentRequest, null> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    @inject(DIToken.IMemberCreditRepository)
    private readonly _memberCreditRepository: IMemberCreditRepository,
  ) {}

  public async execute(
    request: VoidPaymentRequest,
  ): Promise<Result<null, Error>> {
    this._unitOfWork.start();

    try {
      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const payment =
          await this._paymentRepository.findOneByIdOrThrow(request);

        const voidResult = payment.void(request.voidedBy, request.voidReason);

        if (voidResult.isErr()) {
          throw voidResult.error;
        }

        const dues = await this._dueRepository.findByIds({
          ids: payment.dues.map((paymentDue) => paymentDue.dueId),
        });

        await Promise.all(
          dues.map(async (due) => {
            const result = due.voidPayment(payment._id);

            if (result.isErr()) {
              throw result.error;
            }

            await this._dueRepository.updateWithSession(due, unitOfWork);
          }),
        );

        const memberCredit =
          await this._memberCreditRepository.findOneByPayment(payment._id);

        if (memberCredit) {
          await this._memberCreditRepository.deleteWithSession(
            { id: memberCredit._id },
            unitOfWork,
          );
        }

        await this._paymentRepository.updateWithSession(payment, unitOfWork);
      });

      this._logger.info('Payment voided', { payment: request.id });

      return ok(null);
    } catch (error) {
      if (error instanceof BaseError) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }
}
