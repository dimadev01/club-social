declare namespace Meteor {
  interface User {
    profile?: UserProfile;
  }

  interface UserProfile {
    firstName: string;
    isActive: boolean;
    lastName: string;
    role: import('../imports/domain/roles/role.enum').RoleEnum;
    state: import('../imports/domain/users/user.enum').UserStateEnum;
    theme: import('../imports/domain/users/user.enum').UserThemeEnum;
  }
}
