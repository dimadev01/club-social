declare module 'meteor/meteor' {
  namespace Meteor {
    interface User {
      profile?: UserProfile;
      state: import('../imports/domain/users/user.enum').UserStateEnum;
    }

    interface UserProfile {
      firstName: string;
      lastName: string;
      role: import('../imports/domain/roles/role.enum').RoleEnum;
    }
  }
}
