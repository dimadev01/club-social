import { times } from 'lodash';
import { Accounts } from 'meteor/accounts-base';
import {
  AdminRole,
  Permission,
  Role,
  StaffRole,
} from '@domain/roles/roles.enum';
import { faker } from '@faker-js/faker';

// @ts-ignore
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.removeAsync({});

    Roles.getAllRoles().forEach((role) => {
      // @ts-ignore
      Roles.deleteRole(role._id);
    });

    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.removeAsync({});

    Roles.getAllRoles().forEach((role) => {
      // @ts-ignore
      Roles.deleteRole(role._id);
    });

    Roles.createRole(Role.Admin);

    Roles.createRole(Permission.Write);

    Roles.createRole(Permission.Read);

    Roles.createRole(Permission.Delete);

    let userId: string | null = null;

    try {
      userId = Accounts.createUser({
        email: 'info@clubsocialmontegrande.ar',
        profile: {
          firstName: 'Club Social',
          lastName: 'Administración',
          role: Role.Admin,
        },
      });

      Object.entries(AdminRole).forEach(([key, value]) => {
        if (userId) {
          Roles.addUsersToRoles(userId, value, key);
        }
      });

      times(123, () => {
        const newUserId = Accounts.createUser({
          email: faker.internet.email(),
          profile: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            role: Role.Staff,
          },
        });

        Object.entries(StaffRole).forEach(([key, value]) => {
          if (userId) {
            Roles.addUsersToRoles(newUserId, value, key);
          }
        });
      });
    } catch (error) {
      if (userId) {
        await Meteor.users.removeAsync(userId);
      }
    }

    next();
  }),
  version: 1,
});
