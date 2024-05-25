import { Meteor } from 'meteor/meteor';
import { MemberCollection } from '@infra/mongo/collections/member.collection';
import { Member } from '@domain/members/entities/member.entity';

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

Meteor.publish('member', function member(): Mongo.Cursor<Member> | void {
  if (this.userId) {
    return MemberCollection.find({ userId: this.userId });
  }

  return this.ready();
});
