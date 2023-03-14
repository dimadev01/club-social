export enum Role {
  Admin = 'admin',
  Employee = 'employee',
  Member = 'member',
  Professor = 'professor',
  Staff = 'staff',
}

export const getRolesFilters = () =>
  Object.values(Role).map((role) => ({
    text: role,
    value: role,
  }));

export enum Scope {
  Categories = 'categories',
  Employees = 'employees',
  Members = 'members',
  Movements = 'movements',
  Professors = 'professors',
  Rentals = 'rentals',
  Services = 'services',
  Users = 'users',
}

export enum Permission {
  Create = 'write',
  Delete = 'delete',
  Read = 'read',
  Update = 'update',
  ViewDeleted = 'view-deleted',
}

export const AdminRole = {
  [Scope.Users]: [
    Permission.Read,
    Permission.Create,
    Permission.Update,
    Permission.Delete,
  ],
  [Scope.Members]: [
    Permission.Read,
    Permission.Create,
    Permission.Update,
    Permission.Delete,
  ],
  [Scope.Categories]: [Permission.Read, Permission.Update],
  [Scope.Movements]: [
    Permission.Read,
    Permission.Create,
    Permission.Update,
    Permission.Delete,
    Permission.ViewDeleted,
  ],
  [Scope.Professors]: [Permission.Read, Permission.Update],
  [Scope.Rentals]: [Permission.Read, Permission.Update],
  [Scope.Employees]: [Permission.Read, Permission.Update],
  [Scope.Services]: [Permission.Read, Permission.Update],
};

export const StaffRole = {
  [Scope.Members]: [Permission.Read, Permission.Update],
  [Scope.Movements]: [Permission.Read, Permission.Create, Permission.Update],
  [Scope.Categories]: [Permission.Read],
  [Scope.Professors]: [Permission.Read],
  [Scope.Rentals]: [Permission.Read],
  [Scope.Employees]: [Permission.Read],
  [Scope.Services]: [Permission.Read],
};

export const MemberRole = {
  [Scope.Movements]: [Permission.Read],
};
