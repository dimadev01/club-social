import { expect } from 'chai';

import { Id } from '@shared/core/id';

describe('ID', () => {
  it('should create a new ID', () => {
    // Arrange

    // Act
    const id = Id.create();

    // Assert
    expect(id.value).to.be.a.uuid('v4');
  });

  it('should create a new ID with the given passed ID', () => {
    // Arrange
    const props = '123e4567-e89b-12d3-a456-426614174000';

    // Act
    const id = Id.create(props);

    // Assert
    expect(id.value).to.be.equal(props);
  });
});
