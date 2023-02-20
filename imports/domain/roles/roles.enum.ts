export enum Role {
  Admin = 'admin',
  Member = 'member',
  Staff = 'staff',
}

export enum Scope {
  Members = 'members',
  Movements = 'movements',
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
  [Scope.Movements]: [Permission.Read, Permission.Write, Permission.Delete],
};

export const StaffRole = {
  [Scope.Members]: [Permission.Read, Permission.Write],
  [Scope.Movements]: [Permission.Read, Permission.Write],
};

export const MemberRole = {
  [Scope.Movements]: [Permission.Read],
};
