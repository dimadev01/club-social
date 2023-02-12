export enum Role {
  Admin = 'admin',
  Member = 'member',
  Staff = 'staff',
}

export enum Scope {
  Members = 'members',
  Users = 'users',
}

export enum Permission {
  Delete = 'delete',
  Read = 'read',
  Write = 'write',
}

export const AdminRole = {
  [Scope.Users]: [Permission.Read, Permission.Write, Permission.Delete],
  [Scope.Members]: [Permission.Read, Permission.Write, Permission.Delete],
};

export const StaffRole = {
  [Scope.Members]: [Permission.Read, Permission.Write],
};
