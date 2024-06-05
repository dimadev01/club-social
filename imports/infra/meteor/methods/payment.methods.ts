import { GetOneDtoByIdRequestDto } from '@adapters/dtos/get-one-dto-request.dto';
import { injectable } from 'tsyringe';

import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { PaymentController } from '@adapters/controllers/payment.controller';
import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';

@injectable()
export class PaymentMethods extends MeteorMethods {
  public constructor(private readonly _controller: PaymentController) {
    super();
  }

  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PaymentsGet]: (req: GetOneDtoByIdRequestDto) =>
        this._controller.getOne(req),
      [MeteorMethodEnum.PaymentsGetGrid]: (req: GetPaymentsGridRequestDto) =>
        this._controller.getGrid(req),
      [MeteorMethodEnum.PaymentsCreate]: (req: CreatePaymentRequestDto) =>
        this._controller.create(req),
      [MeteorMethodEnum.PaymentsDelete]: (req: GetOneDtoByIdRequestDto) =>
        this._controller.delete(req),
    });
  }
}
