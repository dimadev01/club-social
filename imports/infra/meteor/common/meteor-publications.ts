import { Meteor } from 'meteor/meteor';

import { MemberOld } from '@domain/members/models/member.old';
import { MemberCollectionOld } from '@infra/mongo/collections/member.collection.old';

Meteor.publish(null, function meteor(): Mongo.Cursor<unknown> | void {
  if (this.userId) {
    // @ts-expect-error
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }

  return this.ready();
});

Meteor.publish(
  'userData',
  function userData(): Mongo.Cursor<Meteor.User> | void {
    if (this.userId) {
      return Meteor.users.find(
        { _id: this.userId },
        { fields: { createdAt: 1 } },
      );
    }

    return this.ready();
  },
);

Meteor.publish('member', function member(): Mongo.Cursor<MemberOld> | void {
  if (this.userId) {
    return MemberCollectionOld.find({ userId: this.userId });
  }

  return this.ready();
});
