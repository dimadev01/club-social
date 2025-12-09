export const Role = {
  ADMIN: 'admin',
  MEMBER: 'member',
  STAFF: 'staff',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
