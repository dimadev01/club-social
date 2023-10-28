/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import dayjs from 'dayjs';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import readXlsxFile from 'read-excel-file/node';
import { container } from 'tsyringe';
import {
  CategoryEnum,
  CategoryTypeEnum,
} from '@domain/categories/category.enum';
import { Category } from '@domain/categories/entities/category.entity';
import { Employee } from '@domain/employees/employee.entity';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import {
  MemberCategory,
  MemberFileStatus,
  MemberMaritalStatus,
  MemberNationality,
  MemberSex,
  MemberStatus,
} from '@domain/members/members.enum';
import { CreateMemberUseCase } from '@domain/members/use-cases/create-member/create-member.use-case';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { CreateMovementUseCase } from '@domain/movements/use-cases/create-movement/create-movement.use-case';
import { Professor } from '@domain/professors/professor.entity';
import { ProfessorsCollection } from '@domain/professors/professors.collection';
import { Permission, Role, Scope } from '@domain/roles/roles.enum';
import { Service } from '@domain/services/service.entity';
import { ServicesCollection } from '@domain/services/services.collection';
import { CreateUserUseCase } from '@domain/users/use-cases/create-user/create-user.use-case';
import { CategoriesCollection } from '@infra/mongo/collections/categories.collection';
import { EmployeesCollection } from '@infra/mongo/collections/employees.collection';
import { CurrencyUtils } from '@shared/utils/currency.utils';
import { DateFormatEnum } from '@shared/utils/date.utils';

interface MemberRow {
  address?: string;
  category: 'Socio' | 'Cadete';
  dateOfBirth?: Date;
  documentID?: string;
  email?: string;
  fileStatus?: 'Si' | 'No';
  firstName: string;
  lastName: string;
  maritalStatus?: 'Casado' | 'Divorciado' | 'Soltero' | 'Viudo';
  nationality?: 'Argentino' | 'Ucraniano' | 'Colombiano' | 'Bulgaro';
  phoneNumber?: string;
  sex?: 'Dama' | 'Caballero';
  status: 'Activo' | 'Inactivo';
}

interface MovementRow {
  amount: number;
  category:
    | 'Alquiler de cancha'
    | 'Alquileres'
    | 'Atesoramiento'
    | 'Cuota'
    | 'Estacionamiento'
    | 'Ferias'
    | 'Gastos'
    | 'Honorarios'
    | 'Invitado'
    | 'Luz'
    | 'Mantenimiento'
    | 'Otros ingresos'
    | 'Otros egresos'
    | 'Profesores'
    | 'Servicios';
  date: Date;
  employee?: string;
  fair?: string;
  member?: string;
  notes?: string;
  professor?: string;
  rental?: string;
  service?: string;
}

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    /**
     * We remove everything from the database
     */

    Roles.getAllRoles().forEach((role) => {
      // @ts-expect-error
      Roles.deleteRole(role._id);
    });

    await Meteor.users.removeAsync({});

    await CategoriesCollection.removeAsync({});

    await MembersCollection.removeAsync({});

    await EmployeesCollection.removeAsync({});

    await ProfessorsCollection.removeAsync({});

    await ServicesCollection.removeAsync({});

    await MovementsCollection.removeAsync({});

    /**
     * Create permissions
     */
    Roles.createRole(Permission.Create);

    Roles.createRole(Permission.Read);

    Roles.createRole(Permission.Delete);

    Roles.createRole(Permission.Update);

    /**
     * Create categories
     */
    await Promise.all(
      Object.values(CategoryEnum).map(async (category) =>
        CategoriesCollection.insertEntity(Category.create(category))
      )
    );

    const createUserUseCase = container.resolve(CreateUserUseCase);

    /**
     * Create Admin
     */
    await createUserUseCase.execute({
      emails: ['info@clubsocialmontegrande.ar'],
      firstName: 'Club Social',
      lastName: 'Administración',
      role: Role.Admin,
    });

    /**
     * Create staff
     */
    await createUserUseCase.execute({
      emails: ['guriprina@hotmail.com'],
      firstName: 'Leopoldo',
      lastName: 'Prina',
      role: Role.Staff,
    });

    /**
     * Create staff
     */
    await createUserUseCase.execute({
      emails: ['carlos.sforzini@fscnet.com.ar'],
      firstName: 'Carlos',
      lastName: 'Sforzini',
      role: Role.Staff,
    });

    /**
     * Create professors
     */

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

    await ProfessorsCollection.insertEntity(Professor.create(professor3.value));

    /**
     * Create employees
     */
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

    const employee3 = await createUserUseCase.execute({
      emails: null,
      firstName: 'Leopoldo',
      lastName: 'Prina',
      role: Role.Employee,
    });

    if (employee3.isErr()) {
      throw new Error(employee3.error.message);
    }

    await EmployeesCollection.insertEntity(Employee.create(employee3.value));

    await ServicesCollection.insertEntity(Service.create('AySA', null));

    await ServicesCollection.insertEntity(Service.create('MetroGAS', null));

    await ServicesCollection.insertEntity(Service.create('Edesur', null));

    await ServicesCollection.insertEntity(Service.create('Cardio', null));

    await ServicesCollection.insertEntity(Service.create('Hector Ojeda', null));

    /**
     * Import members
     */
    const importedMembers = await readXlsxFile<MemberRow>(
      Assets.absoluteFilePath('club-social.xlsx'),
      {
        schema: {
          Apellido: {
            prop: 'lastName',
            type: String,
          },
          Categoria: {
            prop: 'category',
            type: String,
          },
          DNI: {
            prop: 'documentID',
            type: String,
          },
          Direccion: {
            prop: 'address',
            type: String,
          },
          Email: {
            prop: 'email',
            type: String,
          },
          Estado: {
            prop: 'status',
            type: String,
          },
          'Estado Civil': {
            prop: 'maritalStatus',
            type: String,
          },
          Ficha: {
            prop: 'fileStatus',
            type: String,
          },
          Nacimiento: {
            prop: 'dateOfBirth',
            type: Date,
          },
          Nacionalidad: {
            prop: 'nationality',
            type: String,
          },
          Nombre: {
            prop: 'firstName',
            type: String,
          },
          Sexo: {
            prop: 'sex',
            type: String,
          },
          Telefono: {
            prop: 'phoneNumber',
            type: String,
          },
        },
        sheet: 2,
      }
    );

    const createMemberUseCase = container.resolve(CreateMemberUseCase);

    for (const row of importedMembers.rows) {
      let category: MemberCategory | null = null;

      if (row.category === 'Socio') {
        category = MemberCategory.Member;
      } else if (row.category === 'Cadete') {
        category = MemberCategory.Cadet;
      }

      let fileStatus: MemberFileStatus | null = null;

      if (row.fileStatus === 'Si') {
        fileStatus = MemberFileStatus.Completed;
      } else if (row.fileStatus === 'No') {
        fileStatus = MemberFileStatus.Pending;
      }

      let maritalStatus: MemberMaritalStatus | null = null;

      if (row.maritalStatus === 'Casado') {
        maritalStatus = MemberMaritalStatus.Married;
      } else if (row.maritalStatus === 'Divorciado') {
        maritalStatus = MemberMaritalStatus.Divorced;
      } else if (row.maritalStatus === 'Soltero') {
        maritalStatus = MemberMaritalStatus.Single;
      } else if (row.maritalStatus === 'Viudo') {
        maritalStatus = MemberMaritalStatus.Widowed;
      }

      let nationality: MemberNationality | null = null;

      if (row.nationality === 'Argentino') {
        nationality = MemberNationality.Argentina;
      } else if (row.nationality === 'Colombiano') {
        nationality = MemberNationality.Colombia;
      } else if (row.nationality === 'Bulgaro') {
        nationality = MemberNationality.Bulgaria;
      } else if (row.nationality === 'Ucraniano') {
        nationality = MemberNationality.Ukraine;
      }

      let sex: MemberSex | null = null;

      if (row.sex === 'Caballero') {
        sex = MemberSex.Male;
      } else if (row.sex === 'Dama') {
        sex = MemberSex.Female;
      }

      let email: string | null = null;

      if (row.email && !Accounts.findUserByEmail(row.email)) {
        email = row.email;
      }

      let status: MemberStatus;

      if (row.status === 'Activo') {
        status = MemberStatus.Active;
      } else {
        status = MemberStatus.Inactive;
      }

      await createMemberUseCase.execute({
        addressCityGovId: null,
        addressCityName: null,
        addressStateGovId: null,
        addressStateName: null,
        addressStreet: row.address ?? null,
        addressZipCode: null,
        category,
        dateOfBirth: row.dateOfBirth
          ? dayjs.utc(row.dateOfBirth).format(DateFormatEnum.Date)
          : null,
        documentID: row.documentID ?? null,
        emails: email ? [email] : null,
        fileStatus,
        firstName: row.firstName,
        lastName: row.lastName,
        maritalStatus,
        nationality,
        phones: row.phoneNumber ? [row.phoneNumber] : null,
        role: Role.Member,
        sex,
        status,
      });
    }

    /**
     * Import movements
     */
    const importedMovements = await readXlsxFile<MovementRow>(
      Assets.absoluteFilePath('club-social.xlsx'),
      {
        schema: {
          Alquiler: {
            prop: 'rental',
            type: String,
          },
          Concepto: {
            prop: 'category',
            type: String,
          },
          Detalles: {
            prop: 'notes',
            type: String,
          },
          Empleado: {
            prop: 'employee',
            type: String,
          },
          Fecha: {
            prop: 'date',
            type: Date,
          },
          Feria: {
            prop: 'fair',
            type: String,
          },
          Importe: {
            prop: 'amount',
            type: Number,
          },
          Profesor: {
            prop: 'professor',
            type: String,
          },
          Servicio: {
            prop: 'service',
            type: String,
          },
          Socio: {
            prop: 'member',
            type: String,
          },
        },
        sheet: 1,
      }
    );

    const createMovementUseCase = container.resolve(CreateMovementUseCase);

    for (const row of importedMovements.rows) {
      let category: CategoryEnum;

      let type: CategoryTypeEnum;

      if (row.category === 'Alquiler de cancha') {
        category = CategoryEnum.CourtRental;

        type = CategoryTypeEnum.Income;
      } else if (row.category === 'Cuota') {
        if (row.amount < 0) {
          category = CategoryEnum.MembershipDebt;

          type = CategoryTypeEnum.Debt;
        } else {
          category = CategoryEnum.MembershipIncome;

          type = CategoryTypeEnum.Income;
        }
      } else if (row.category === 'Ferias') {
        category = CategoryEnum.Fair;

        type = CategoryTypeEnum.Income;
      } else if (row.category === 'Servicios') {
        category = CategoryEnum.Service;

        type = CategoryTypeEnum.Expense;
      } else if (row.category === 'Profesores') {
        category = CategoryEnum.Professor;

        type = CategoryTypeEnum.Income;
      } else if (row.category === 'Atesoramiento') {
        category = CategoryEnum.Saving;

        type = CategoryTypeEnum.Expense;
      } else if (row.category === 'Estacionamiento') {
        category = CategoryEnum.Parking;

        type = CategoryTypeEnum.Income;
      } else if (row.category === 'Gastos') {
        category = CategoryEnum.Expense;

        type = CategoryTypeEnum.Expense;
      } else if (row.category === 'Honorarios') {
        category = CategoryEnum.Employee;

        type = CategoryTypeEnum.Expense;
      } else if (row.category === 'Invitado') {
        if (row.amount < 0) {
          category = CategoryEnum.GuestDebt;

          type = CategoryTypeEnum.Debt;
        } else {
          category = CategoryEnum.GuestIncome;

          type = CategoryTypeEnum.Income;
        }
      } else if (row.category === 'Luz') {
        if (row.amount < 0) {
          category = CategoryEnum.ElectricityDebt;

          type = CategoryTypeEnum.Debt;
        } else {
          category = CategoryEnum.ElectricityIncome;

          type = CategoryTypeEnum.Income;
        }
      } else if (row.category === 'Mantenimiento') {
        category = CategoryEnum.Maintenance;

        type = CategoryTypeEnum.Expense;
      } else if (row.category === 'Otros egresos') {
        category = CategoryEnum.OtherExpense;

        type = CategoryTypeEnum.Expense;
      } else {
        category = CategoryEnum.OtherIncome;

        type = CategoryTypeEnum.Income;
      }

      const members = await MembersCollection.rawCollection()
        .aggregate<Member>([
          {
            $lookup: {
              as: 'user',
              foreignField: '_id',
              from: 'users',
              localField: 'userId',
            },
          },
          {
            $unwind: '$user',
          },
        ])
        .toArray();

      const professors = await ProfessorsCollection.rawCollection()
        .aggregate<Professor>([
          {
            $lookup: {
              as: 'user',
              foreignField: '_id',
              from: 'users',
              localField: 'userId',
            },
          },
          {
            $unwind: '$user',
          },
        ])
        .toArray();

      const employees = await EmployeesCollection.rawCollection()
        .aggregate<Employee>([
          {
            $lookup: {
              as: 'user',
              foreignField: '_id',
              from: 'users',
              localField: 'userId',
            },
          },
          {
            $unwind: '$user',
          },
        ])
        .toArray();

      const services = await ServicesCollection.find().fetchAsync();

      let memberId: string | null = null;

      let professorId: string | null = null;

      let employeeId: string | null = null;

      const rentalId: string | null = null;

      let serviceId: string | null = null;

      if (row.member) {
        const member = members.find(
          (m) =>
            // @ts-expect-error
            `${m.user?.profile.lastName} ${m.user?.profile.firstName}` ===
            row.member
        );

        if (member) {
          memberId = member._id;
        }
      } else if (row.professor) {
        const professor = professors.find(
          (p) =>
            // @ts-expect-error
            `${p.user?.profile.lastName} ${p.user?.profile.firstName}` ===
            row.professor
        );

        if (professor) {
          professorId = professor._id;
        }
      } else if (row.employee) {
        const employee = employees.find(
          (e) =>
            // @ts-expect-error
            `${e.user?.profile.lastName} ${e.user?.profile.firstName}` ===
            row.employee
        );

        if (employee) {
          employeeId = employee._id;
        }
      } else if (row.service) {
        const service = services.find((s) => s.name === row.service);

        if (service) {
          serviceId = service._id;
        }
      }

      await createMovementUseCase.execute({
        amount: CurrencyUtils.toCents(Math.abs(row.amount)),
        category,
        date: dayjs.utc(row.date).format(DateFormatEnum.Date),
        employeeId,
        memberIds: memberId ? [memberId] : null,
        notes: row.notes ?? null,
        professorId,
        rentalId,
        serviceId,
        type,
      });
    }

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
    Roles.createRole(Permission.ViewDeleted);

    const admin = await Meteor.users.findOneAsync({
      'profile.role': Role.Admin,
    });

    if (!admin) {
      throw new Meteor.Error('admin-not-found');
    }

    Roles.addUsersToRoles(admin, Permission.ViewDeleted, Scope.Movements);

    next();
  }),
  version: 2,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const staff = await Meteor.users
      .find({ 'profile.role': Role.Staff })
      .fetchAsync();

    staff.forEach((user) => {
      Roles.removeUsersFromRoles(user, [Permission.Read], Scope.Categories);

      Roles.removeUsersFromRoles(user, [Permission.Read], Scope.Professors);

      Roles.removeUsersFromRoles(user, [Permission.Read], 'rentals');

      Roles.removeUsersFromRoles(user, [Permission.Read], Scope.Employees);

      Roles.removeUsersFromRoles(user, [Permission.Read], Scope.Services);
    });

    await MovementsCollection.updateAsync(
      // @ts-expect-error
      { category: 'rental' },
      { $set: { category: CategoryEnum.Buffet } },
      { multi: true }
    );

    CategoriesCollection.insertEntity(Category.create(CategoryEnum.Buffet));

    CategoriesCollection.insertEntity(Category.create(CategoryEnum.Saloon));

    next();
  }),
  version: 3,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    const staff = await Meteor.users
      .find({
        'profile.role': Role.Staff,
      })
      .fetchAsync();

    staff.forEach((user) => {
      Roles.addUsersToRoles(user, Permission.Create, Scope.Members);
    });

    next();
  }),
  version: 4,
});

// @ts-expect-error
Migrations.add({
  down: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    next();
  }),
  up: Meteor.wrapAsync(async (_: unknown, next: () => void) => {
    await CategoriesCollection.updateAsync(
      {},
      {
        $set: {
          deletedAt: null,
          deletedBy: null,
          historical: [],
          isDeleted: false,
        },
      },
      {
        multi: true,
      }
    );

    next();
  }),
  version: 5,
});
