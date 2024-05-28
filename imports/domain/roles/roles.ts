import { PermissionEnum, RoleEnum, ScopeEnum } from '@domain/roles/role.enum';
import { RoleAssignmentType } from '@domain/roles/role.types';

export const AdminRole = {
  [ScopeEnum.USERS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
    PermissionEnum.DELETE,
  ],
  [ScopeEnum.PAYMENTS]: [
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
  [ScopeEnum.PROFESSORS]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.EMPLOYEES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
  [ScopeEnum.SERVICES]: [PermissionEnum.READ, PermissionEnum.UPDATE],
};

export const StaffRole = {
  [ScopeEnum.MEMBERS]: [
    PermissionEnum.CREATE,
    PermissionEnum.READ,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.MOVEMENTS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.DUES]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.PAYMENTS]: [
    PermissionEnum.READ,
    PermissionEnum.CREATE,
    PermissionEnum.UPDATE,
  ],
  [ScopeEnum.USERS]: [PermissionEnum.CREATE, PermissionEnum.UPDATE],
};

export const MemberRole = {
  [ScopeEnum.DUES]: [PermissionEnum.READ],
  [ScopeEnum.PAYMENTS]: [PermissionEnum.READ],
};

export const ViewerRole = {
  [ScopeEnum.MEMBERS]: [PermissionEnum.READ],
  [ScopeEnum.MOVEMENTS]: [PermissionEnum.READ],
  [ScopeEnum.USERS]: [PermissionEnum.READ],
};

export const RolePermissionAssignment: RoleAssignmentType = {
  [RoleEnum.ADMIN]: AdminRole,
  [RoleEnum.STAFF]: StaffRole,
  [RoleEnum.MEMBER]: MemberRole,
  [RoleEnum.EMPLOYEE]: {},
  [RoleEnum.PROFESSOR]: {},
  [RoleEnum.VIEWER]: ViewerRole,
};
