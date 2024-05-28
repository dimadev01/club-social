interface CreateUserProfile extends Meteor.UserProfile {
  state: import('../imports/domain/users/user.enum').UserStateEnum;
}

declare namespace Accounts {
  function onCreateUser(
    func: (
      options: { profile?: CreateUserProfile | undefined },
      user: Meteor.User,
    ) => void,
  ): void;

  function createUser(
    options: {
      email?: string | undefined;
      password?: string | undefined;
      profile?: CreateUserProfile | undefined;
      username?: string | undefined;
    },
    callback?: (error?: Error | Meteor.Error | Meteor.TypedError) => void,
  ): string;

  function createUserAsync(
    options: {
      email: string;
      password?: string | undefined;
      profile?: CreateUserProfile | undefined;
      username?: string | undefined;
    },
    callback?: (error?: Error | Meteor.Error | Meteor.TypedError) => void,
  ): Promise<string>;
}
