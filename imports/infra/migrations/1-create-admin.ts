import { Permission, Role, Scope } from '@domain/roles/roles.enum';

// @ts-ignore
Migrations.add({
  down: () => {},
  up: async () => {
    await Meteor.users.removeAsync({});

    Roles.getAllRoles().forEach((role) => {
      // @ts-ignore
      Roles.deleteRole(role._id);
    });

    Roles.createRole(Role.Admin);

    Roles.createRole(Role.Member);

    Roles.createRole(Role.Staff);

    Roles.createRole(Permission.Write);

    Roles.createRole(Permission.Delete);

    Roles.createRole(Permission.Read);

    let userId: string | null = null;

    try {
      // @ts-ignore
      userId = await Accounts.createUserVerifyingEmail({
        email: 'info@clubsocialmontegrande.ar',
        password: '3214',
        profile: {
          firstName: 'Club',
          lastName: 'Social',
        },
      });

      if (userId) {
        Roles.addUsersToRoles(
          userId,
          [Permission.Delete, Permission.Read, Permission.Write],
          Scope.Users
        );
      }
    } catch (error) {
      if (userId) {
        await Meteor.users.removeAsync(userId);
      }
    }
  },
  version: 1,
});

// @ts-ignore
Migrations.add({
  down: () => {},
  up: async () => {
    await Meteor.users.removeAsync({});

    console.log('about to sleep');

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 3000);
    });

    console.log('woke up');
  },
  version: 2,
});
