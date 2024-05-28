export enum RoleEnum {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  MEMBER = 'member',
  PROFESSOR = 'professor',
  STAFF = 'staff',
  VIEWER = 'viewer',
}

export enum ScopeEnum {
  CATEGORIES = 'categories',
  DUES = 'dues',
  EMPLOYEES = 'employees',
  MEMBERS = 'members',
  MOVEMENTS = 'movements',
  PAYMENTS = 'payments',
  PROFESSORS = 'professors',
  SERVICES = 'services',
  USERS = 'users',
}

export enum PermissionEnum {
  CREATE = 'write',
  DELETE = 'delete',
  READ = 'read',
  UPDATE = 'update',
  VIEW_DELETED = 'view-deleted',
}

export const ScopePermissionAssignment: Record<ScopeEnum, PermissionEnum[]> = {
  [ScopeEnum.CATEGORIES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.EMPLOYEES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.SERVICES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.PROFESSORS]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.MEMBERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.PAYMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.USERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
};

export const AdminRole = {
  [ScopeEnum.USERS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.MEMBERS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.CATEGORIES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
    PermissionEnum.VIEW_DELETED,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
    PermissionEnum.VIEW_DELETED,
  ],
  [ScopeEnum.PROFESSORS]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.EMPLOYEES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.SERVICES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
};

export const StaffRole = {
  [ScopeEnum.MEMBERS]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.USERS]: [PermissionEnum.CREATE, PermissionEnum.UPDATE],
};

export const MemberRole = {
  [ScopeEnum.MOVEMENTS]: [PermissionEnum.READ],
};

export const ViewerRole = {
  [ScopeEnum.MEMBERS]: [PermissionEnum.READ],
  [ScopeEnum.MOVEMENTS]: [PermissionEnum.READ],
};
