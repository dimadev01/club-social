import { Accounts } from 'meteor/accounts-base';
import { MembersCollection } from '@domain/members/members.collection';
import { AdminRole, Permission, Role } from '@domain/roles/roles.enum';

// @ts-ignore
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.removeAsync({});

    Roles.getAllRoles().forEach((role) => {
      // @ts-ignore
      Roles.deleteRole(role._id);
    });

    await MembersCollection.removeAsync({});

    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.removeAsync({});

    Roles.getAllRoles().forEach((role) => {
      // @ts-ignore
      Roles.deleteRole(role._id);
    });

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
    } catch (error) {
      if (userId) {
        await Meteor.users.removeAsync(userId);
      }
    }

    next();
  }),
  version: 1,
});

// @ts-ignore
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.removeAsync({});

    Roles.getAllRoles().forEach((role) => {
      // @ts-ignore
      Roles.deleteRole(role._id);
    });

    await MembersCollection.removeAsync({});

    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.removeAsync({});

    Roles.getAllRoles().forEach((role) => {
      // @ts-ignore
      Roles.deleteRole(role._id);
    });

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
    } catch (error) {
      if (userId) {
        await Meteor.users.removeAsync(userId);
      }
    }

    next();
  }),
  version: 2,
});
