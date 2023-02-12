import { Meteor } from 'meteor/meteor';

Meteor.publish(null, function meteor(): Mongo.Cursor<unknown> | void {
  if (this.userId) {
    // @ts-ignore
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }

  return this.ready();
});
