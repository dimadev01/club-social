import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { container } from 'tsyringe';
import { CategoriesCollection } from '@domain/categories/categories.collection';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { Category } from '@domain/categories/category.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { Professor } from '@domain/professors/professor.entity';
import { ProfessorsCollection } from '@domain/professors/professors.collection';
import {
  AdminRole,
  Permission,
  Role,
  Scope,
  StaffRole,
} from '@domain/roles/roles.enum';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';

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

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await ProfessorsCollection.removeAsync({});

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user1 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Alejandro',
      lastName: 'Cucurullo',
      role: Role.Professor,
    });

    if (user1.isErr()) {
      throw new Error(user1.error.message);
    }

    await ProfessorsCollection.insertEntity(Professor.create(user1.value));

    const user2 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Claudio',
      lastName: 'Saade',
      role: Role.Professor,
    });

    if (user2.isErr()) {
      throw new Error(user2.error.message);
    }

    await ProfessorsCollection.insertEntity(Professor.create(user2.value));

    const user3 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Sacha',
      lastName: 'Ramirez',
      role: Role.Professor,
    });

    if (user3.isErr()) {
      throw new Error(user3.error.message);
    }

    await ProfessorsCollection.insertEntity(Professor.create(user3.value));

    await Meteor.users
      .find({ 'profile.role': Role.Admin })
      .forEachAsync((admin: Meteor.User) => {
        Roles.addUsersToRoles(
          admin._id,
          AdminRole[Scope.Professors],
          Scope.Professors
        );
      });

    await Meteor.users
      .find({ 'profile.role': Role.Staff })
      .forEachAsync((staff: Meteor.User) => {
        Roles.addUsersToRoles(
          staff._id,
          StaffRole[Scope.Professors],
          Scope.Professors
        );
      });

    next();
  }),
  version: 2,
});
