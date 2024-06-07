import { injectable } from 'tsyringe';

import { GetOneByIdRequestDto } from '@adapters/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@adapters/common/meteor/meteor-methods.enum';
import { PaymentController } from '@adapters/controllers/payment.controller';
import { CreatePaymentRequestDto } from '@adapters/dtos/create-payment-request.dto';
import { GetPaymentsGridRequestDto } from '@adapters/dtos/get-payments-grid-request.dto';
import { VoidPaymentRequestDto } from '@adapters/dtos/void-payment-request.dto';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';

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
      [MeteorMethodEnum.PaymentsDelete]: (req: GetOneByIdRequestDto) =>
        this._controller.delete(req),
      [MeteorMethodEnum.PaymentsVoid]: (req: VoidPaymentRequestDto) =>
        this._controller.void({
          ...req,
          voidedBy: this.getCurrentUserName(),
        }),
    });
  }
}
