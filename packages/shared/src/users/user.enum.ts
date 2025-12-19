export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const UserRole = {
  ADMIN: 'admin',
  MEMBER: 'member',
  STAFF: 'staff',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserRoleLabel = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MEMBER]: 'Socio',
  [UserRole.STAFF]: 'Staff',
} as const;

export const UserStatusLabel = {
  [UserStatus.ACTIVE]: 'Activo',
  [UserStatus.INACTIVE]: 'Inactivo',
} as const;

export const UserStatusSort = {
  [UserStatus.ACTIVE]: 1,
  [UserStatus.INACTIVE]: 2,
} as const;

export type UserStatusSort =
  (typeof UserStatusSort)[keyof typeof UserStatusSort];
