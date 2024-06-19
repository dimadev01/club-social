import 'chai/register-expect';

import { expect } from 'chai';
import dayjs from 'dayjs';
import { Random } from 'meteor/random';

import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DuePaymentInTheFutureError } from '@domain/dues/errors/due-payment-in-the-future.error';
import { DuePayment } from '@domain/dues/models/due-payment.model';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';

describe('DuePayment', () => {
  it('should create a DuePayment', () => {
    const duePayment = DuePayment.createOne({
      creditAmount: new Money({ amount: 0 }),
      date: new DateVo(),
      directAmount: new Money({ amount: 500000 }),
      paymentId: Random.id(),
      receiptNumber: null,
      source: PaymentDueSourceEnum.DIRECT,
      totalAmount: new Money({ amount: 500000 }),
    });

    expect(duePayment.isErr()).to.be.false;
  });

  it('should create a DuePayment error because the date is in the future', () => {
    const duePayment = DuePayment.createOne({
      creditAmount: new Money({ amount: 0 }),
      date: new DateVo(dayjs().add(1, 'day')),
      directAmount: new Money({ amount: 500000 }),
      paymentId: Random.id(),
      receiptNumber: null,
      source: PaymentDueSourceEnum.DIRECT,
      totalAmount: new Money({ amount: 500000 }),
    })._unsafeUnwrapErr();

    expect(duePayment).to.be.an.instanceOf(DuePaymentInTheFutureError);
  });
});
