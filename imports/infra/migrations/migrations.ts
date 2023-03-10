import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { container } from 'tsyringe';
import { CategoriesCollection } from '@domain/categories/categories.collection';
import { CategoryEnum } from '@domain/categories/categories.enum';
import { Category } from '@domain/categories/category.entity';
import { Employee } from '@domain/employees/employee.entity';
import { EmployeesCollection } from '@domain/employees/employees.collection';
import { MembersCollection } from '@domain/members/members.collection';
import { Professor } from '@domain/professors/professor.entity';
import { ProfessorsCollection } from '@domain/professors/professors.collection';
import { Rental } from '@domain/rentals/rental.entity';
import { RentalsCollection } from '@domain/rentals/rentals.collection';
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
      // @ts-expect-error
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
    // Professors
    await ProfessorsCollection.removeAsync({});

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const professor1 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Alejandro',
      lastName: 'Cucurullo',
      role: Role.Professor,
    });

    if (professor1.isErr()) {
      throw new Error(professor1.error.message);
    }

    await ProfessorsCollection.insertEntity(Professor.create(professor1.value));

    const professor2 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Claudio',
      lastName: 'Saade',
      role: Role.Professor,
    });

    if (professor2.isErr()) {
      throw new Error(professor2.error.message);
    }

    await ProfessorsCollection.insertEntity(Professor.create(professor2.value));

    const professor3 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Sacha',
      lastName: 'Ramirez',
      role: Role.Professor,
    });

    if (professor3.isErr()) {
      throw new Error(professor3.error.message);
    }

    // Employees
    await EmployeesCollection.removeAsync({});

    const employee1 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Dario',
      lastName: 'Ponce',
      role: Role.Employee,
    });

    if (employee1.isErr()) {
      throw new Error(employee1.error.message);
    }

    await EmployeesCollection.insertEntity(Employee.create(employee1.value));

    const employee2 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Lautaro',
      lastName: 'Baigorria',
      role: Role.Employee,
    });

    if (employee2.isErr()) {
      throw new Error(employee2.error.message);
    }

    await EmployeesCollection.insertEntity(Employee.create(employee2.value));

    // Rentals
    await RentalsCollection.insertEntity(Rental.create('Salón', null));

    await RentalsCollection.insertEntity(Rental.create('Buffet', null));

    await RentalsCollection.insertEntity(Rental.create('Ferias', null));

    // Roles attachment
    await Meteor.users
      .find({ 'profile.role': Role.Admin })
      .forEachAsync((admin: Meteor.User) => {
        Roles.addUsersToRoles(
          admin._id,
          AdminRole[Scope.Professors],
          Scope.Professors
        );

        Roles.addUsersToRoles(
          admin._id,
          AdminRole[Scope.Rentals],
          Scope.Rentals
        );

        Roles.addUsersToRoles(
          admin._id,
          AdminRole[Scope.Employees],
          Scope.Employees
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

        Roles.addUsersToRoles(
          staff._id,
          AdminRole[Scope.Rentals],
          Scope.Rentals
        );

        Roles.addUsersToRoles(
          staff._id,
          AdminRole[Scope.Employees],
          Scope.Employees
        );
      });

    next();
  }),
  version: 2,
});
