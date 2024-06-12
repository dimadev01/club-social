/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import invariant from 'tiny-invariant';
import { container } from 'tsyringe';
import '@infra/di/di.container';

import { VoidDueUseCase } from '@application/dues/use-cases/void-due/void-due.use-case';
import {
  MovementCategoryEnum,
  MovementStatusEnum,
  MovementTypeEnum,
} from '@domain/categories/category.enum';
import { DueCategoryEnum, DueStatusEnum } from '@domain/dues/due.enum';
import { MemberStatusEnum } from '@domain/members/member.enum';
import {
  PaymentDueSourceEnum,
  PaymentStatusEnum,
} from '@domain/payments/payment.enum';
import { RoleEnum } from '@domain/roles/role.enum';
import { RoleService } from '@domain/roles/role.service';
import { UserStateEnum, UserThemeEnum } from '@domain/users/user.enum';
import { DueMongoCollection } from '@infra/mongo/collections/due.collection';
import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';
import { MovementMongoCollection } from '@infra/mongo/collections/movement.collection';
import { PaymentMongoCollection } from '@infra/mongo/collections/payment.collection';
import { UserMongoCollection } from '@infra/mongo/collections/user.collection';
import { MovementEntity } from '@infra/mongo/entities/movement.entity';
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
      .resolve(DueMongoCollection)
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
      .resolve(PaymentMongoCollection)
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
    const dueCollection = container.resolve(DueMongoCollection);

    const paymentsCollection = container.resolve(PaymentMongoCollection);

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
                status: PaymentStatusEnum.PAID,
              };
            })
            .filter(Boolean) ?? [];

        const totalPaidAmount = duePayments.reduce(
          (acc: any, duePayment: any) => acc + duePayment.amount,
          0,
        );

        let totalPendingAmount = oldDue.amount - totalPaidAmount;

        let { status } = oldDue;

        if (totalPendingAmount < 0) {
          totalPendingAmount = 0;
        } else if (
          totalPendingAmount > 0 &&
          oldDue.status === DueStatusEnum.PAID
        ) {
          status = DueStatusEnum.PARTIALLY_PAID;
        }

        await dueCollection.updateAsync(oldDue._id, {
          $set: {
            memberId: oldDue.member._id,
            payments: duePayments,
            status,
            totalPaidAmount,
            totalPendingAmount,
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
      {
        multi: true,
      },
    );

    await RoleService.update();

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
    const memberCollection = container.resolve(MemberMongoCollection);

    const paymentsCollection = container.resolve(PaymentMongoCollection);

    const duesCollection = container.resolve(DueMongoCollection);

    const usersCollection = container.resolve(UserMongoCollection);

    const members = await memberCollection.find().fetchAsync();

    const users = await usersCollection.collection.find().fetchAsync();

    await Promise.all(
      members.map(async (member) => {
        const user = users.find((u) => u._id === member.userId);

        invariant(user);

        invariant(user.profile);

        await memberCollection.updateAsync(member._id, {
          $set: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
          },
        });
      }),
    );

    await memberCollection.rawCollection().dropIndexes();

    await memberCollection.createIndexAsync(
      { firstName: 1, lastName: 1 },
      { name: 'm_fn_ln' },
    );

    await paymentsCollection.rawCollection().dropIndexes();

    await paymentsCollection.createIndexAsync(
      { memberId: 1, createdAt: -1 },
      { name: 'p_mi_ca' },
    );

    await paymentsCollection.createIndexAsync(
      { createdAt: -1 },
      { name: 'p_ca' },
    );

    await duesCollection.rawCollection().dropIndexes();

    await duesCollection.createIndexAsync(
      { memberId: 1, createdAt: -1 },
      { name: 'd_mi_ca' },
    );

    await duesCollection.createIndexAsync({ createdAt: -1 }, { name: 'd_ca' });

    const movementsCollection = container.resolve(MovementMongoCollection);

    await movementsCollection.updateAsync(
      {},
      { $set: { status: MovementStatusEnum.REGISTERED } },
      { multi: true },
    );

    await movementsCollection.removeAsync({ isMigrated: true });

    await movementsCollection.createIndexAsync(
      { createdAt: -1 },
      { name: 'm_ca' },
    );

    await movementsCollection.createIndexAsync(
      { category: 1, createdAt: -1 },
      { name: 'm_c_ca' },
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
    RoleService.update();

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
    const memberCollection = container.resolve(MemberMongoCollection);

    await memberCollection.createIndexAsync(
      { lastName: 1, firstName: 1 },
      { name: 'm_ln_fn' },
    );

    /**
     * Payments
     */
    const paymentsCollection = container.resolve(PaymentMongoCollection);

    await paymentsCollection.rawCollection().dropIndexes();

    await paymentsCollection.createIndexAsync(
      { memberId: 1, createdAt: -1, date: -1 },
      { name: 'p_mi_ca_d' },
    );

    await paymentsCollection.createIndexAsync(
      { createdAt: -1, date: -1 },
      { name: 'p_ca_d' },
    );

    /**
     * Dues
     */
    const duesCollection = container.resolve(DueMongoCollection);

    await duesCollection.rawCollection().dropIndexes();

    await duesCollection.createIndexAsync(
      { memberId: 1, createdAt: -1, date: -1 },
      { name: 'd_mi_ca_d' },
    );

    await duesCollection.createIndexAsync(
      { createdAt: -1, date: -1 },
      { name: 'd_ca_d' },
    );

    /**
     * Movements
     */
    const movementsCollection = container.resolve(MovementMongoCollection);

    await movementsCollection.rawCollection().dropIndexes();

    await movementsCollection.createIndexAsync(
      { createdAt: -1, date: -1 },
      { name: 'm_ca_d' },
    );

    await movementsCollection.createIndexAsync(
      { category: 1, createdAt: -1, date: -1 },
      { name: 'm_c_ca_d' },
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
    const paymentsCollection = container.resolve(PaymentMongoCollection);

    const movementsCollection = container.resolve(MovementMongoCollection);

    const payments = await paymentsCollection.find().fetchAsync();

    await Promise.all(
      payments.map(async (payment) => {
        const movement: MovementEntity = {
          _id: Random.id(),
          amount: payment.amount,
          category: MovementCategoryEnum.MEMBER_PAYMENT,
          createdAt: payment.createdAt,
          date: payment.date,
          notes: payment.notes,
          status: MovementStatusEnum.REGISTERED,
          type: MovementTypeEnum.INCOME,
          createdBy: payment.createdBy,
          deletedAt: payment.deletedAt,
          deletedBy: payment.deletedBy,
          isDeleted: payment.isDeleted,
          updatedAt: payment.updatedAt,
          updatedBy: payment.updatedBy,
          paymentId: payment._id,
          employeeId: null,
          professorId: null,
          serviceId: null,
          voidedAt: null,
          voidedBy: null,
          voidReason: null,
        };

        await movementsCollection.insertAsync(movement);
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
