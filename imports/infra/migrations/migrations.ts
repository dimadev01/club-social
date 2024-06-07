/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meteor } from 'meteor/meteor';
import { container } from 'tsyringe';

import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';
import { RoleEnum } from '@domain/roles/role.enum';
import { RoleService } from '@domain/roles/role.service';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';
import { DueCollection } from '@infra/mongo/collections/due.collection';
import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';
import { PaymentCollection } from '@infra/mongo/collections/payment.collection';
import { DateUtils } from '@shared/utils/date.utils';

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await RoleService.update2();

    next();
  }),
  version: 14,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await container
      .resolve(DueCollection)
      .rawCollection()
      .updateMany(
        {
          category: DueCategoryEnum.ELECTRICITY,
          date: {
            $gte: DateUtils.utc('2024-01-02').toDate(),
          },
        },
        [
          {
            $set: {
              date: {
                $subtract: ['$date', 1000 * 60 * 60 * 24],
              },
            },
          },
        ],
      );

    next();
  }),
  version: 15,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await RoleService.update2();

    next();
  }),
  version: 16,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.updateAsync(
      {},
      { $set: { state: UserStateEnum.ACTIVE } },
      { multi: true },
    );

    next();
  }),
  version: 17,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await container
      .resolve(PaymentCollection)
      .updateAsync({}, { $set: { receiptNumber: null } }, { multi: true });

    next();
  }),
  version: 18,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.updateAsync(
      {},
      { $set: { 'profile.theme': UserThemeEnum.AUTO } },
      { multi: true },
    );

    /**
     * Dues
     */
    const dueCollection = container.resolve(DueCollection);

    const paymentsCollection = container.resolve(PaymentCollection);

    const dues = await dueCollection
      .rawCollection()
      // @ts-expect-error
      .find({ memberId: null })
      .toArray();

    /**
     * Payments
     */
    const payments: any = await paymentsCollection
      .rawCollection()
      // @ts-expect-error
      .find({ memberId: null })
      .toArray();

    await Promise.all(
      dues.map(async (oldDue: any) => {
        const duePayments =
          oldDue.payments
            ?.map((oldDuePayment: any) => {
              const payment = payments.find(
                (p: any) => p._id === oldDuePayment._id,
              );

              if (!payment) {
                return undefined;
              }

              return {
                amount: oldDuePayment.amount,
                date: oldDuePayment.date,
                paymentId: oldDuePayment._id,
                receiptNumber: payment?.receiptNumber ?? null,
              };
            })
            .filter(Boolean) ?? [];

        let totalPaidAmount = duePayments.reduce(
          (acc: any, duePayment: any) => acc + duePayment.amount,
          0,
        );

        let balanceAmount = oldDue.amount - totalPaidAmount;

        let { status } = oldDue;

        if (balanceAmount < 0) {
          balanceAmount = 0;

          totalPaidAmount = oldDue.amount;
        } else if (balanceAmount > 0 && oldDue.status === DueStatusEnum.PAID) {
          status = DueStatusEnum.PARTIALLY_PAID;
        }

        await dueCollection.updateAsync(oldDue._id, {
          $set: {
            balanceAmount,
            memberId: oldDue.member._id,
            payments: duePayments,
            status,
            totalPaidAmount,
          },
          $unset: {
            member: 1,
          },
        });
      }),
    );

    await Promise.all(
      payments.map(async (oldPayment: any) => {
        const paymentDues = oldPayment.dues.map((oldPaymentDue: any) => ({
          amount: oldPaymentDue.amount,
          dueAmount: oldPaymentDue.due.amount,
          dueCategory: oldPaymentDue.due.category,
          dueDate: oldPaymentDue.due.date,
          dueId: oldPaymentDue.due._id,
          source: PaymentDueSourceEnum.DIRECT,
        }));

        await paymentsCollection.updateAsync(oldPayment._id, {
          $set: {
            amount: paymentDues.reduce(
              (acc: any, paymentDue: any) => acc + paymentDue.amount,
              0,
            ),
            dues: paymentDues,
            memberId: oldPayment.member._id,
            receiptNumber: oldPayment.receiptNumber ?? null,
          },
          $unset: {
            member: 1,
          },
        });
      }),
    );

    const users = await Meteor.users.find().fetchAsync();

    await Promise.all(
      users.map(async (user) => {
        await Meteor.users.updateAsync(user._id, {
          $set: {
            createdBy: 'System',
            deletedAt: null,
            isDeleted: false,
            // @ts-expect-error
            'profile.state': user.state,
            updatedAt: user.createdAt,
            updatedBy: 'System',
          },
          $unset: {
            state: 1,
            username: 1,
          },
        });
      }),
    );

    await container
      .resolve(DueCollection)
      .rawCollection()
      .createIndex({ memberId: 1 }, { name: 'd_mi' });

    container
      .resolve(MemberMongoCollection)
      .update({}, { $unset: { user: 1 } }, { multi: true });

    await Meteor.users.updateAsync(
      {
        $or: [
          {
            'profile.role': 'employee',
          },
          {
            'profile.role': 'professor',
          },
        ],
      },
      {
        $set: {
          'profile.role': RoleEnum.MEMBER,
        },
      },
    );

    RoleService.update2();

    next();
  }),
  version: 19,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const duesCollection = container.resolve(DueCollection);

    await duesCollection.rawCollection().updateMany(
      {
        isDeleted: true,
      },
      [
        {
          $set: {
            deletedAt: null,
            deletedBy: null,
            isDeleted: false,
            status: DueStatusEnum.VOIDED,
            voidReason: 'Migración',
            voidedAt: '$deletedAt',
            voidedBy: '$deletedBy',
          },
        },
      ],
    );

    const paymentsCollection = container.resolve(PaymentCollection);

    await paymentsCollection.rawCollection().updateMany(
      {
        isDeleted: true,
      },
      [
        {
          $set: {
            deletedAt: null,
            deletedBy: null,
            isDeleted: false,
            status: DueStatusEnum.VOIDED,
            voidReason: 'Migración',
            voidedAt: '$deletedAt',
            voidedBy: '$deletedBy',
          },
        },
      ],
    );

    next();
  }),
  version: 20,
});
