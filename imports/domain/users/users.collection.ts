import SimpleSchema from 'simpl-schema';

// @ts-expect-error
Meteor.users.attachSchema(
  new SimpleSchema({
    createdAt: Date,
    emails: {
      optional: true,
      type: Array,
    },
    'emails.$': Object,
    'emails.$.address': String,
    'emails.$.verified': Boolean,
    heartbeat: {
      optional: true,
      type: Date,
    },
    profile: Object,
    'profile.firstName': String,
    'profile.lastName': String,
    'profile.role': String,
    services: {
      blackbox: true,
      optional: true,
      type: Object,
    },
    username: {
      optional: true,
      type: String,
    },
  })
);
