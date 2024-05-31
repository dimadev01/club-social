import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { GetPaymentsGridUseCase } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { BaseController } from '@infra/controllers/base.controller';
import { GetPaymentsGridRequestDto } from '@infra/controllers/payment/get-payments-grid-request.dto';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class PaymentController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    @inject(GetPaymentsGridUseCase)
    private readonly _getPaymentsGridUseCase: GetPaymentsGridUseCase,
  ) {
    super(logger);
  }

  protected register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PaymentsGetGrid]: (
        request: GetPaymentsGridRequestDto,
      ) =>
        this.execute({
          classType: GetPaymentsGridRequestDto,
          request,
          useCase: this._getPaymentsGridUseCase,
        }),
    });
  }
}
