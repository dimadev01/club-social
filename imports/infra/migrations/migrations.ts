import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { CategoriesCollection } from '@domain/categories/categories.collection';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { Category } from '@domain/categories/category.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { AdminRole, Permission, Role } from '@domain/roles/roles.enum';

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await Meteor.users.removeAsync({});

    Roles.getAllRoles().forEach((role) => {
      // @ts-expect-error
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

    await Promise.all(
      Object.values(CategoryEnum).map(async (category) =>
        CategoriesCollection.insertEntity(Category.create(category))
      )
    );

    next();
  }),
  version: 1,
});
