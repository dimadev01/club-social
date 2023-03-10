export enum Role {
  Admin = 'admin',
  Employee = 'employee',
  Member = 'member',
  Professor = 'professor',
  Staff = 'staff',
}

export enum Scope {
  Categories = 'categories',
  Employees = 'employees',
  Members = 'members',
  Movements = 'movements',
  Professors = 'professors',
  Rentals = 'rentals',
  Users = 'users',
}

export enum Permission {
  Delete = 'delete',
  Read = 'read',
  Write = 'write',
}

export const AdminRole = {
  [Scope.Users]: [Permission.Read, Permission.Write, Permission.Delete],
  [Scope.Members]: [Permission.Read, Permission.Write, Permission.Delete],
  [Scope.Movements]: [Permission.Read, Permission.Write, Permission.Delete],
  [Scope.Professors]: [Permission.Read, Permission.Write],
  [Scope.Rentals]: [Permission.Read, Permission.Write],
  [Scope.Employees]: [Permission.Read, Permission.Write],
};

export const StaffRole = {
  [Scope.Members]: [Permission.Read, Permission.Write],
  [Scope.Movements]: [Permission.Read, Permission.Write],
  [Scope.Categories]: [Permission.Read],
  [Scope.Professors]: [Permission.Read],
  [Scope.Rentals]: [Permission.Read],
  [Scope.Employees]: [Permission.Read],
};

export const MemberRole = {
  [Scope.Movements]: [Permission.Read],
};
