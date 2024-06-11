import { injectable } from 'tsyringe';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { PaymentController } from '@adapters/controllers/payment.controller';
import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { GetPaymentsTotalsRequestDto } from '@adapters/dtos/get-payments-totals-request.dto';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { VoidPaymentMethodRequestDto } from '@infra/meteor/dtos/void-payment-method-request.dto';

@injectable()
export class PaymentMethods extends MeteorMethods {
  public constructor(private readonly _controller: PaymentController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PaymentsGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(this._controller.getOne.bind(this._controller), req),
      [MeteorMethodEnum.PaymentsGetGrid]: (req: GetPaymentsGridRequestDto) =>
        this.execute(this._controller.getGrid.bind(this._controller), req),
      [MeteorMethodEnum.PaymentsCreate]: (req: CreatePaymentRequestDto) =>
        this.execute(this._controller.create.bind(this._controller), req),
      [MeteorMethodEnum.PaymentsGetTotals]: (
        req: GetPaymentsTotalsRequestDto,
      ) => this.execute(this._controller.getTotals.bind(this._controller), req),
      [MeteorMethodEnum.PaymentsVoid]: (req: VoidPaymentMethodRequestDto) =>
        this.execute(this._controller.void.bind(this._controller), {
          ...req,
          voidedBy: this.getCurrentUserName(),
        }),
    });
  }
}
