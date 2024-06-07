import invariant from 'tiny-invariant';

export abstract class MeteorMethods {
  protected getCurrentUser(): Meteor.User {
    const user = Meteor.user();

    invariant(user);

    return user;
  }

  protected getCurrentUserName(): string {
    const user = this.getCurrentUser();

    invariant(user.profile);

    return `${user.profile.firstName} ${user.profile.lastName}`;
  }

  public abstract register(): void;
}
