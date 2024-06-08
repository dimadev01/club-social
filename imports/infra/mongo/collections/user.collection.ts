import { singleton } from 'tsyringe';

@singleton()
export class UserMongoCollection {
  public get collection(): Mongo.Collection<Meteor.User> {
    return Meteor.users;
  }
}
