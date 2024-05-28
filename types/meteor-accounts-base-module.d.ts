interface CreateUserProfile extends Meteor.UserProfile {
  state: import('../imports/domain/users/user.enum').UserStateEnum;
}

declare module 'meteor/accounts-base' {
  namespace Accounts {
    function onCreateUser(
      func: (
        options: { profile?: CreateUserProfile | undefined },
        user: Meteor.User,
      ) => void,
    ): void;
  }
}
