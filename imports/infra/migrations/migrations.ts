import { AdminRole, Permission, Role } from '@domain/roles/roles.enum';

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
      // @ts-ignore
      userId = await Accounts.createUserVerifyingEmail({
        email: 'info@clubsocialmontegrande.ar',
        password: '3214',
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
