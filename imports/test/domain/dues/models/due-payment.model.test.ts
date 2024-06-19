import { expect } from 'chai';

import { DateTimeVo } from '@domain/common/value-objects/date-time.value-object';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { CreateDuePayment, IDuePayment } from '@domain/dues/due.interface';
import { DuePaymentAlreadyVoidedError } from '@domain/dues/errors/due-payment-already-voided.error';
import { DuePayment } from '@domain/dues/models/due-payment.model';
import { PaymentInTheFutureError } from '@domain/payments/errors/payment-in-the-future.error';
import { PaymentReceiptNumberError } from '@domain/payments/errors/payment-receipt-number.error';
import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';

const AMOUNT_ZERO = 0;

const AMOUNT_FIVE_HUNDRED_THOUSAND = 5000_00;

const A_PAYMENT_ID = 'yBGXNyCYRkD5xYCrr';

const VALID_RECEIPT_NUMBER = 1;

describe('DuePayment', () => {
  const createValidDuePayment = (props?: Partial<IDuePayment>): DuePayment =>
    new DuePayment({
      creditAmount: new Money({ amount: AMOUNT_ZERO }),
      directAmount: new Money({ amount: AMOUNT_FIVE_HUNDRED_THOUSAND }),
      paymentDate: new DateTimeVo().subtract(1, 'day'),
      paymentId: A_PAYMENT_ID,
      paymentReceiptNumber: VALID_RECEIPT_NUMBER,
      paymentStatus: PaymentStatusEnum.PAID,
      source: PaymentDueSourceEnum.DIRECT,
      totalAmount: new Money({ amount: AMOUNT_FIVE_HUNDRED_THOUSAND }),
      ...props,
    });

  describe('.createOne()', () => {
    const getValidDuePaymentProps = (
      props?: Partial<CreateDuePayment>,
    ): CreateDuePayment => ({
      creditAmount: new Money({ amount: AMOUNT_ZERO }),
      directAmount: new Money({ amount: AMOUNT_FIVE_HUNDRED_THOUSAND }),
      paymentDate: new DateTimeVo().subtract(1, 'day'),
      paymentId: A_PAYMENT_ID,
      paymentReceiptNumber: VALID_RECEIPT_NUMBER,
      source: PaymentDueSourceEnum.DIRECT,
      totalAmount: new Money({ amount: AMOUNT_FIVE_HUNDRED_THOUSAND }),
      ...props,
    });

    it('should create a DuePayment successfully', () => {
      const props = getValidDuePaymentProps();

      const duePayment = DuePayment.createOne(props);

      expect(duePayment.isErr()).to.be.false;
    });

    it('should return an error because the payment date is in the future', () => {
      const props = getValidDuePaymentProps({
        paymentDate: new DateVo().add(1, 'day'),
      });

      const duePayment = DuePayment.createOne(props)._unsafeUnwrapErr();

      expect(duePayment).to.be.an.instanceOf(PaymentInTheFutureError);
    });

    it('should return an error because the payment receipt numbers is 0', () => {
      const props = getValidDuePaymentProps({ paymentReceiptNumber: 0 });

      const duePayment = DuePayment.createOne(props)._unsafeUnwrapErr();

      expect(duePayment).to.be.an.instanceOf(PaymentReceiptNumberError);
    });

    it('should return an error because the payment receipt numbers is negative', () => {
      const props = getValidDuePaymentProps({ paymentReceiptNumber: -1 });

      const duePayment = DuePayment.createOne(props)._unsafeUnwrapErr();

      expect(duePayment).to.be.an.instanceOf(PaymentReceiptNumberError);
    });
  });

  describe('.void()', () => {
    it('should void a DuePayment', () => {
      const duePayment = createValidDuePayment({
        paymentStatus: PaymentStatusEnum.PAID,
      });

      duePayment.void();

      expect(duePayment.isVoided()).to.be.true;
    });

    it('should return an error because the DuePayment is already voided', () => {
      const duePayment = createValidDuePayment({
        paymentStatus: PaymentStatusEnum.VOIDED,
      });

      const voidResult = duePayment.void()._unsafeUnwrapErr();

      expect(voidResult).to.be.an.instanceOf(DuePaymentAlreadyVoidedError);
    });
  });
});
