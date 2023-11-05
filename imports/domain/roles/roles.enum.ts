export enum RoleEnum {
  Admin = 'admin',
  Employee = 'employee',
  Member = 'member',
  Professor = 'professor',
  Staff = 'staff',
}

export const getRolesFilters = () =>
  Object.values(RoleEnum).map((role) => ({
    text: role,
    value: role,
  }));

export enum ScopeEnum {
  Categories = 'categories',
  Employees = 'employees',
  Members = 'members',
  Movements = 'movements',
  Professors = 'professors',
  Services = 'services',
  Users = 'users',
}

export enum PermissionEnum {
  Create = 'write',
  Delete = 'delete',
  Read = 'read',
  Update = 'update',
  ViewDeleted = 'view-deleted',
}

export const AdminRole = {
  [ScopeEnum.Users]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
  [ScopeEnum.Members]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
  [ScopeEnum.Categories]: [PermissionEnum.Read, PermissionEnum.Update],
  [ScopeEnum.Movements]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
    PermissionEnum.Delete,
    PermissionEnum.ViewDeleted,
  ],
  [ScopeEnum.Professors]: [PermissionEnum.Read, PermissionEnum.Update],
  [ScopeEnum.Employees]: [PermissionEnum.Read, PermissionEnum.Update],
  [ScopeEnum.Services]: [PermissionEnum.Read, PermissionEnum.Update],
};

export const StaffRole = {
  [ScopeEnum.Members]: [PermissionEnum.Read, PermissionEnum.Update],
  [ScopeEnum.Movements]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
  ],
  [ScopeEnum.Users]: [PermissionEnum.Create, PermissionEnum.Update],
};

export const MemberRole = {
  [ScopeEnum.Movements]: [PermissionEnum.Read],
};

export const RolePermissionAssignment = {
  [RoleEnum.Admin]: AdminRole,
  [RoleEnum.Staff]: StaffRole,
  [RoleEnum.Member]: MemberRole,
  [RoleEnum.Employee]: {},
  [RoleEnum.Professor]: {},
};
