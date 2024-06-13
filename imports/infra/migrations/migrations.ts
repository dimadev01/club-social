/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meteor } from 'meteor/meteor';
import { container } from 'tsyringe';
import '@infra/di/di.container';

import { VoidDueUseCase } from '@application/dues/use-cases/void-due/void-due.use-case';
import { DueStatusEnum } from '@domain/dues/due.enum';
import { MemberStatusEnum } from '@domain/members/member.enum';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';
import { DueMongoCollection } from '@infra/mongo/collections/due.collection';
import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';
import { MovementMongoCollection } from '@infra/mongo/collections/movement.collection';
import { PaymentMongoCollection } from '@infra/mongo/collections/payment.collection';
import { DueMapper } from '@infra/mongo/mappers/due.mapper';

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const movementsCollection = container.resolve(MovementMongoCollection);

    await movementsCollection.createIndexAsync(
      { paymentId: 1 },
      { name: 'm_pi' },
    );

    next();
  }),
  version: 24,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const membersCollection = container.resolve(MemberMongoCollection);

    const inactiveMembers = await membersCollection
      .find({ status: MemberStatusEnum.INACTIVE })
      .fetchAsync();

    const duesCollection = container.resolve(DueMongoCollection);

    await Promise.all(
      inactiveMembers.map(async (member) => {
        const dues = await duesCollection
          .find({ status: DueStatusEnum.PENDING, memberId: member._id })
          .fetchAsync();

        await Promise.all(
          dues.map(async (due) => {
            const voidDueUseCase = container.resolve(VoidDueUseCase);

            await voidDueUseCase.execute({
              id: due._id,
              voidedBy: 'System',
              voidReason: 'Member is inactive',
            });
          }),
        );
      }),
    );

    const movementsCollection = container.resolve(MovementMongoCollection);

    await movementsCollection.createIndexAsync(
      { paymentId: 1 },
      { name: 'm_pi' },
    );

    next();
  }),
  version: 25,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const paymentsCollection = container.resolve(PaymentMongoCollection);

    await paymentsCollection.removeAsync({ isDeleted: true });

    const duesCollection = container.resolve(DueMongoCollection);

    await duesCollection.removeAsync({ isDeleted: true });

    const payments = await paymentsCollection.find({}).fetchAsync();

    const dues = await duesCollection.find({}).fetchAsync();

    console.log('2');

    await Promise.all(
      payments.map(async (payment) => {
        await paymentsCollection.updateAsync(
          { _id: payment._id },
          {
            $set: {
              voidedAt: payment.voidedAt ?? null,
              voidedBy: payment.voidedBy ?? null,
              voidReason: payment.voidReason ?? null,
              // @ts-expect-error
              dues: payment.dues
                .map((paymentDue: any) => {
                  const due = dues.find((d) => d._id === paymentDue.dueId);

                  if (!due) {
                    return undefined;
                  }

                  const duePayment = due.payments.find(
                    (p) => p.paymentId === payment._id,
                  );

                  if (!duePayment) {
                    return undefined;
                  }

                  const indexOfPaymentInDue = due.payments.indexOf(duePayment);

                  const reduced = due.payments.reduce((acc, dp, index) => {
                    if (index >= indexOfPaymentInDue) {
                      return acc + 0;
                    }

                    // @ts-expect-error
                    return acc + dp.amount;
                  }, 0);

                  return {
                    totalAmount: paymentDue.amount,
                    directAmount: paymentDue.amount,
                    creditAmount: 0,
                    dueAmount: paymentDue.dueAmount,
                    dueCategory: paymentDue.dueCategory,
                    dueDate: paymentDue.dueDate,
                    dueId: paymentDue.dueId,
                    source: paymentDue.source,
                    duePendingAmount:
                      indexOfPaymentInDue === 0
                        ? due.amount
                        : due.amount - reduced,
                  };
                })
                .filter(Boolean),
            },
          },
        );
      }),
    );

    await Promise.all(
      dues.map(async (due) => {
        await duesCollection.updateAsync(
          { _id: due._id },
          {
            $set: {
              voidedAt: due.voidedAt ?? null,
              voidedBy: due.voidedBy ?? null,
              voidReason: due.voidReason ?? null,
              // @ts-expect-error
              payments: due.payments
                .map((duePayment: any) => {
                  const payment = payments.find(
                    (p) => p._id === duePayment.paymentId,
                  );

                  if (!payment) {
                    return undefined;
                  }

                  const dueInPayment = payment.dues.find(
                    (d) => d.dueId === due._id,
                  );

                  if (!dueInPayment) {
                    return undefined;
                  }

                  return {
                    paymentId: duePayment.paymentId,
                    totalAmount: duePayment.amount,
                    creditAmount: 0,
                    directAmount: duePayment.amount,
                    paymentReceiptNumber: duePayment.receiptNumber,
                    source: PaymentDueSourceEnum.DIRECT,
                    paymentStatus: duePayment.status,
                    paymentDate: duePayment.date,
                  };
                })
                .filter(Boolean),
            },
          },
        );
      }),
    );

    const duesAgain = await duesCollection.find({}).fetchAsync();

    const duesMapper = container.resolve(DueMapper);

    await Promise.all(
      duesAgain.map(async (due) => {
        const dueDomain = duesMapper.toDomain(due);

        dueDomain.calculateTotalPendingAmount();

        await duesCollection.updateAsync(
          { _id: due._id },
          {
            $set: {
              totalPendingAmount: dueDomain.totalPendingAmount.value,
            },
          },
        );
      }),
    );

    next();
  }),
  version: 26,
});
