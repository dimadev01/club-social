import { UserStateEnum } from '@domain/users/user.enum';

declare namespace Meteor {
  interface UserProfile {
    firstName: string;
    lastName: string;
    role: string;
    state: UserStateEnum;
  }
}
