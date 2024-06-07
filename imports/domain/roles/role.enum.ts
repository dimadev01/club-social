export enum RoleEnum {
  ADMIN = 'admin',
  MEMBER = 'member',
  STAFF = 'staff',
}

export enum ScopeEnum {
  DUES = 'dues',
  MEMBERS = 'members',
  MOVEMENTS = 'movements',
  PAYMENTS = 'payments',
  USERS = 'users',
}

export enum PermissionEnum {
  CREATE = 'create',
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
  ],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
    PermissionEnum.VOID,
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
    PermissionEnum.VOID,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.USERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
  ],
};

type ScopePermissions = {
  [scope in ScopeEnum]: PermissionEnum[];
};

export const AdminRole: ScopePermissions = {
  [ScopeEnum.USERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.MEMBERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.PAYMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
};

export const StaffRole: ScopePermissions = {
  [ScopeEnum.MEMBERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.PAYMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.USERS]: [],
};

export const MemberRole: ScopePermissions = {
  [ScopeEnum.DUES]: [PermissionEnum.READ],
  [ScopeEnum.PAYMENTS]: [PermissionEnum.READ],
  [ScopeEnum.MEMBERS]: [],
  [ScopeEnum.MOVEMENTS]: [],
  [ScopeEnum.USERS]: [],
};

type RoleScopePermission = {
  [x in RoleEnum]: ScopePermissions;
};

export const RoleAssignment: RoleScopePermission = {
  [RoleEnum.ADMIN]: AdminRole,
  [RoleEnum.MEMBER]: MemberRole,
  [RoleEnum.STAFF]: StaffRole,
};
