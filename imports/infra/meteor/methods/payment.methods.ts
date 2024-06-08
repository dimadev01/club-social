import { injectable } from 'tsyringe';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { PaymentController } from '@adapters/controllers/payment.controller';
import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { VoidPaymentMethodRequestDto } from '@infra/meteor/dtos/void-payment-method-request.dto';

@injectable()
export class PaymentMethods extends MeteorMethods {
  public constructor(private readonly _controller: PaymentController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PaymentsGet]: (req: GetOneByIdRequestDto) =>
        this._controller.getOne(req),
      [MeteorMethodEnum.PaymentsGetGrid]: (req: GetPaymentsGridRequestDto) =>
        this._controller.getGrid(req),
      [MeteorMethodEnum.PaymentsCreate]: (req: CreatePaymentRequestDto) =>
        this._controller.create(req),
      [MeteorMethodEnum.PaymentsVoid]: (req: VoidPaymentMethodRequestDto) =>
        this._controller.void({
          ...req,
          voidedBy: this.getCurrentUserName(),
        }),
    });
  }
}
