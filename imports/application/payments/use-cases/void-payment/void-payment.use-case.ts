import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerRepository } from '@application/common/logger/logger.interface';
import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { IUseCase } from '@application/common/use-case.interface';
import { IDueRepository } from '@application/dues/repositories/due.repository';
import { IMemberCreditRepository } from '@application/members/repositories/member-credit.repository';
import { IMovementRepository } from '@application/movements/repositories/movement.repository';
import { VoidMovementUseCase } from '@application/movements/use-cases/void-movement/void-movement.use-case';
import { IPaymentRepository } from '@application/payments/repositories/payment.repository';
import { VoidPaymentRequest } from '@application/payments/use-cases/void-payment/void-payment.request';
import { DomainError } from '@domain/common/errors/domain.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { PaymentNotVoidableError } from '@domain/payments/errors/payment-not-voidable.error';

@injectable()
export class VoidPaymentUseCase implements IUseCase<VoidPaymentRequest, null> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILoggerRepository,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    @inject(DIToken.IMemberCreditRepository)
    private readonly _memberCreditRepository: IMemberCreditRepository,
    private readonly _voidMovementUseCase: VoidMovementUseCase,
  ) {}

  public async execute(
    request: VoidPaymentRequest,
  ): Promise<Result<null, Error>> {
    this._unitOfWork.start();

    try {
      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const payment =
          await this._paymentRepository.findOneByIdOrThrow(request);

        if (!payment.isVoidable()) {
          throw new PaymentNotVoidableError();
        }

        const voidResult = payment.void(request.voidedBy, request.voidReason);

        if (voidResult.isErr()) {
          throw voidResult.error;
        }

        await this._paymentRepository.updateWithSession(payment, unitOfWork);

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

        const movement = await this._movementRepository.findOneByPaymentOrThrow(
          {
            id: payment._id,
          },
        );

        const result = await this._voidMovementUseCase.execute({
          id: movement._id,
          unitOfWork,
          voidReason: request.voidReason,
          voidedBy: request.voidedBy,
        });

        if (result.isErr()) {
          throw result.error;
        }

        const memberCredits = await this._memberCreditRepository.findByPayment(
          payment._id,
        );

        await Promise.all(
          memberCredits.map(async (memberCredit) => {
            await this._memberCreditRepository.deleteWithSession(
              { id: memberCredit._id },
              unitOfWork,
            );
          }),
        );
      });

      this._logger.info('Payment voided', { payment: request.id });

      return ok(null);
    } catch (error) {
      this._logger.error(error);

      if (error instanceof DomainError) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }
}
