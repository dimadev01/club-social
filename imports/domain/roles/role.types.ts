import { PermissionEnum, RoleEnum, ScopeEnum } from '@domain/roles/role.enum';

export type RoleAssignmentType = {
  [role in RoleEnum]: ScopeAssignmentType;
};

export type ScopeAssignmentType = {
  [scope in ScopeEnum]?: PermissionEnum[];
};
