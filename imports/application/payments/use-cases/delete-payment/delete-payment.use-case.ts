import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { BaseError } from '@domain/common/errors/base.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { DueStatusEnum } from '@domain/dues/due.enum';
import { IDueRepository } from '@domain/dues/due.repository';
import { IPaymentDueRepository } from '@domain/payments/payment-due.repository';
import { IPaymentRepository } from '@domain/payments/payment.repository';

@injectable()
export class DeletePaymentUseCase implements IUseCase<FindOneById, null> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    @inject(DIToken.IPaymentDueRepository)
    private readonly _paymentDueRepository: IPaymentDueRepository,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
  ) {}

  public async execute(request: FindOneById): Promise<Result<null, Error>> {
    const paymentDues = await this._paymentDueRepository.findByPayment({
      paymentId: request.id,
    });

    const dues = await this._dueRepository.findByIds({
      ids: paymentDues.map((paymentDue) => paymentDue.dueId),
    });

    this._unitOfWork.start();

    try {
      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        await Promise.all(
          dues.map(async (due) => {
            due.setStatus(DueStatusEnum.PENDING);

            await this._dueRepository.updateWithSession(due, unitOfWork);
          }),
        );

        await Promise.all(
          paymentDues.map(async (paymentDue) => {
            await this._paymentDueRepository.deleteWithSession(
              { id: paymentDue._id },
              unitOfWork,
            );
          }),
        );

        await this._paymentRepository.deleteWithSession(request, unitOfWork);
      });

      this._logger.info('Payment deleted', { payment: request.id });

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
