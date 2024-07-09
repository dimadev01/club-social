export enum RoleEnum {
  ADMIN = 'admin',
  MEMBER = 'member',
  STAFF = 'staff',
}

export const RoleLabel: {
  [x in RoleEnum]: string;
} = {
  [RoleEnum.ADMIN]: 'Administrador',
  [RoleEnum.MEMBER]: 'Socio',
  [RoleEnum.STAFF]: 'Staff',
};

export enum ScopeEnum {
  DUES = 'dues',
  EVENTS = 'events',
  MEMBERS = 'members',
  MOVEMENTS = 'movements',
  PAYMENTS = 'payments',
  PRICES = 'prices',
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

type ScopePermissions = {
  [scope in ScopeEnum]: PermissionEnum[];
};

export const AdminRole: ScopePermissions = {
  [ScopeEnum.USERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.EVENTS]: [PermissionEnum.READ],
  [ScopeEnum.MEMBERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.PAYMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.PRICES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
};

export const StaffRole: ScopePermissions = {
  [ScopeEnum.MEMBERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.PRICES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.EVENTS]: [PermissionEnum.READ],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.VOID,
    PermissionEnum.UPDATE,
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
  [ScopeEnum.EVENTS]: [],
  [ScopeEnum.PRICES]: [],
};

type RoleScopePermission = {
  [x in RoleEnum]: ScopePermissions;
};

export const RoleAssignment: RoleScopePermission = {
  [RoleEnum.ADMIN]: AdminRole,
  [RoleEnum.MEMBER]: MemberRole,
  [RoleEnum.STAFF]: StaffRole,
};
