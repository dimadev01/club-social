import { inject, injectable } from 'tsyringe';

import { BaseController } from '@adapters/common/controllers/base.controller';
import { MeteorMethodEnum } from '@adapters/meteor/meteor-methods.enum';
import { ILogger } from '@domain/common/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { GetPaymentsGridUseCase } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.use-case';
import { GetPaymentsGridRequestDto } from '@infra/controllers/payment/get-payments-grid-request.dto';

@injectable()
export class PaymentController extends BaseController {
  public constructor(
    @inject(DIToken.Logger)
    protected readonly logger: ILogger,
    private readonly _getPaymentsGridUseCase: GetPaymentsGridUseCase,
  ) {
    super(logger);
  }

  public register(): void {
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
