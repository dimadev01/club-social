import { singleton } from 'tsyringe';

@singleton()
export class UserCollection2 {
  public get collection(): Mongo.Collection<Meteor.User> {
    return Meteor.users;
  }
}
