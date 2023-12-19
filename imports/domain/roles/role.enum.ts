export enum RoleEnum {
  Admin = 'admin',
  Employee = 'employee',
  Member = 'member',
  Professor = 'professor',
  Staff = 'staff',
  Viewer = 'viewer',
}

export enum ScopeEnum {
  Categories = 'categories',
  Dues = 'dues',
  Employees = 'employees',
  Members = 'members',
  Movements = 'movements',
  Payments = 'payments',
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

export const ScopePermissionAssignment: Record<ScopeEnum, PermissionEnum[]> = {
  [ScopeEnum.Categories]: [PermissionEnum.Read, PermissionEnum.Update],
  [ScopeEnum.Employees]: [PermissionEnum.Read, PermissionEnum.Update],
  [ScopeEnum.Services]: [PermissionEnum.Read, PermissionEnum.Update],
  [ScopeEnum.Professors]: [PermissionEnum.Read, PermissionEnum.Update],
  [ScopeEnum.Members]: [
    PermissionEnum.Create,
    PermissionEnum.Read,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
  [ScopeEnum.Movements]: [
    PermissionEnum.Create,
    PermissionEnum.Read,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
  [ScopeEnum.Dues]: [
    PermissionEnum.Create,
    PermissionEnum.Read,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
  [ScopeEnum.Payments]: [
    PermissionEnum.Create,
    PermissionEnum.Read,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
  [ScopeEnum.Users]: [
    PermissionEnum.Create,
    PermissionEnum.Read,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
};

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
  [ScopeEnum.Dues]: [
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

export const ViewerRole = {
  [ScopeEnum.Members]: [PermissionEnum.Read],
  [ScopeEnum.Movements]: [PermissionEnum.Read],
};
