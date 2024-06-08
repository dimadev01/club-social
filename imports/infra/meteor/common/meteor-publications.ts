import { Meteor } from 'meteor/meteor';
import { container } from 'tsyringe';

import { MemberMongoCollection } from '@infra/mongo/collections/member.collection';
import { MemberEntity } from '@infra/mongo/entities/member.entity';

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

Meteor.publish('member', function member(): Mongo.Cursor<MemberEntity> | void {
  if (this.userId) {
    return container
      .resolve(MemberMongoCollection)
      .find({ userId: this.userId });
  }

  return this.ready();
});
