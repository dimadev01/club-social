declare namespace Meteor {
  interface User {
    profile?: UserProfile;
    state: import('../imports/domain/users/user.enum').UserStateEnum;
  }

  interface UserProfile {
    firstName: string;
    lastName: string;
    role: import('../imports/domain/roles/role.enum').RoleEnum;
    theme: import('../imports/domain/users/user.enum').UserThemeEnum;
  }
}
