import { expect } from 'chai';

import {
  DueAggregate,
  DueAggregateProps,
} from '@modules/dues/domain/due.aggregate';

describe('DueAggregate', () => {
  describe('.create()', () => {
    it('should create a new Due with the provided props', () => {
      // Arrange
      const props: DueAggregateProps = {
        amount: 100,
      };

      // Act
      const due = DueAggregate.create(props);

      // Assert
      expect(due.isOk()).to.be.true;
    });
  });
});
