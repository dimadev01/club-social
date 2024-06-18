import assert from 'assert';

import { Meteor } from 'meteor/meteor';

describe('meteor-typescript-2', () => {
  if (Meteor.isServer) {
    it('server is not client', () => {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
