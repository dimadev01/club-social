import { injectable } from 'tsyringe';

import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { VoidPaymentMethodRequestDto } from '@infra/meteor/dtos/void-payment-method-request.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { PaymentController } from '@ui/controllers/payment.controller';
import { CreatePaymentRequestDto } from '@ui/dtos/create-payment-request.dto';
import { GetPaymentsGridRequestDto } from '@ui/dtos/get-payments-grid-request.dto';
import { GetPaymentsTotalsRequestDto } from '@ui/dtos/get-payments-totals-request.dto';

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
