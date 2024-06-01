import { singleton } from 'tsyringe';

@singleton()
export class UserCollection {
  public get collection(): Mongo.Collection<Meteor.User> {
    return Meteor.users;
  }
}
