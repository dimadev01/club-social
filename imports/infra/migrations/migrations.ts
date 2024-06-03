/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meteor } from 'meteor/meteor';
import { container } from 'tsyringe';

import { DueCategoryEnum } from '@domain/dues/due.enum';
import { RoleService } from '@domain/roles/role.service';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';
import { DueCollection } from '@infra/mongo/collections/due.collection';
import { PaymentDueCollection } from '@infra/mongo/collections/payment-due.collection';
import { PaymentCollection } from '@infra/mongo/collections/payment.collection';
import { DateUtils } from '@shared/utils/date.utils';

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await RoleService.update();

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
    await RoleService.update();

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
    /**
     * Dues
     */
    const dues = await container
      .resolve(DueCollection)
      .rawCollection()
      // @ts-expect-error
      .find({ memberId: null })
      .toArray();

    await Promise.all(
      dues.map(async (oldDue: any) => {
        await container.resolve(DueCollection).updateAsync(oldDue._id, {
          $set: {
            memberId: oldDue.member._id,
          },
          $unset: {
            member: 1,
            payments: 1,
          },
        });
      }),
    );

    /**
     * Payments
     */
    const payments: any = await container
      .resolve(PaymentCollection)
      .rawCollection()
      // @ts-expect-error
      .find({ memberId: null })
      .toArray();

    await Promise.all(
      payments.map(async (oldPayment: any) => {
        await Promise.all(
          oldPayment.dues.map(async (oldPaymentDue: any) => {
            const newPaymentDue: any = {
              amount: oldPaymentDue.amount,
              dueId: oldPaymentDue.due._id,
              paymentId: oldPayment._id,
            };

            newPaymentDue.isDeleted = oldPayment.isDeleted;

            newPaymentDue.createdAt = oldPayment.createdAt;

            newPaymentDue.createdBy = oldPayment.createdBy;

            newPaymentDue.updatedAt = oldPayment.updatedAt;

            newPaymentDue.updatedBy = oldPayment.updatedBy;

            newPaymentDue.deletedAt = oldPayment.deletedAt;

            newPaymentDue.deletedBy = oldPayment.deletedBy;

            await container
              .resolve(PaymentDueCollection)
              .insertAsync(newPaymentDue);
          }),
        );

        await container.resolve(PaymentCollection).updateAsync(oldPayment._id, {
          $set: {
            memberId: oldPayment.member._id,
          },
          $unset: {
            dues: 1,
            member: 1,
          },
        });
      }),
    );

    next();
  }),
  version: 20,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const users = await Meteor.users.find().fetchAsync();

    await Promise.all(
      users.map(async (user) => {
        await Meteor.users.updateAsync(user._id, {
          $set: {
            createdBy: 'System',
            deletedAt: null,
            isDeleted: false,
            updatedAt: user.createdAt,
            updatedBy: 'System',
          },
        });
      }),
    );

    next();
  }),
  version: 21,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const users = await Meteor.users.find().fetchAsync();

    await Promise.all(
      users.map(async (user) => {
        await Meteor.users.updateAsync(user._id, {
          $set: {
            // @ts-expect-error
            'profile.state': user.state,
          },
          $unset: {
            state: 1,
          },
        });
      }),
    );

    next();
  }),
  version: 22,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const users = await Meteor.users.find().fetchAsync();

    await Promise.all(
      users.map(async (user) => {
        await Meteor.users.updateAsync(user._id, {
          $unset: { username: 1 },
        });
      }),
    );

    next();
  }),
  version: 23,
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
      .createIndex({ memberId: 1 }, { name: 'd_mi' });

    next();
  }),
  version: 24,
});
