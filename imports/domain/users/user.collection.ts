import SimpleSchema from 'simpl-schema';

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
      defaultValue: null,
      optional: true,
      type: Date,
    },
    profile: Object,
    'profile.firstName': String,
    'profile.lastName': String,
    'profile.role': String,
    'profile.theme': String,
    services: {
      blackbox: true,
      defaultValue: null,
      optional: true,
      type: Object,
    },
    state: String,
    username: {
      defaultValue: null,
      optional: true,
      type: String,
    },
  }),
);
