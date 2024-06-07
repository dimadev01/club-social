export enum RoleEnum {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  MEMBER = 'member',
  PROFESSOR = 'professor',
  STAFF = 'staff',
  VIEWER = 'viewer',
}

export enum ScopeEnum {
  DUES = 'dues',
  MEMBERS = 'members',
  MOVEMENTS = 'movements',
  PAYMENTS = 'payments',
  USERS = 'users',
}

export enum PermissionEnum {
  CREATE = 'write',
  DELETE = 'delete',
  READ = 'read',
  UPDATE = 'update',
  VIEW_DELETED = 'view-deleted',
  VOID = 'void',
}

export const ScopePermissionAssignment: Record<ScopeEnum, PermissionEnum[]> = {
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
    PermissionEnum.VOID,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.PAYMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
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
    PermissionEnum.VOID,
  ],
  [ScopeEnum.PAYMENTS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
    PermissionEnum.VIEW_DELETED,
    PermissionEnum.VOID,
  ],
};

export const StaffRole = {
  [ScopeEnum.MEMBERS]: [
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.CREATE,
  ],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.PAYMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.USERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.READ,
  ],
};

export const MemberRole = {
  [ScopeEnum.DUES]: [PermissionEnum.READ],
  [ScopeEnum.PAYMENTS]: [PermissionEnum.READ],
};
