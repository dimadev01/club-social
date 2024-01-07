import { PermissionEnum, RoleEnum, ScopeEnum } from '@domain/roles/role.enum';
import { RoleAssignmentType } from '@domain/roles/role.types';

export const AdminRole = {
  [ScopeEnum.Users]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
  [ScopeEnum.Dues]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
    PermissionEnum.Delete,
  ],
  [ScopeEnum.Payments]: [
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
  [ScopeEnum.Members]: [
    PermissionEnum.Create,
    PermissionEnum.Read,
    PermissionEnum.Update,
  ],
  [ScopeEnum.Movements]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
  ],
  [ScopeEnum.Dues]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
  ],
  [ScopeEnum.Payments]: [
    PermissionEnum.Read,
    PermissionEnum.Create,
    PermissionEnum.Update,
  ],
  [ScopeEnum.Users]: [PermissionEnum.Create, PermissionEnum.Update],
};

export const MemberRole = {
  [ScopeEnum.Movements]: [PermissionEnum.Read],
  [ScopeEnum.Dues]: [PermissionEnum.Read],
  [ScopeEnum.Payments]: [PermissionEnum.Read],
};

export const ViewerRole = {
  [ScopeEnum.Members]: [PermissionEnum.Read],
  [ScopeEnum.Movements]: [PermissionEnum.Read],
  [ScopeEnum.Users]: [PermissionEnum.Read],
};

export const RolePermissionAssignment: RoleAssignmentType = {
  [RoleEnum.Admin]: AdminRole,
  [RoleEnum.Staff]: StaffRole,
  [RoleEnum.Member]: MemberRole,
  [RoleEnum.Employee]: {},
  [RoleEnum.Professor]: {},
  [RoleEnum.Viewer]: ViewerRole,
};
