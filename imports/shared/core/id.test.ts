import { expect } from 'chai';

import { ID } from '@shared/core/id';

describe('ID', () => {
  it('should create a new ID', () => {
    // Arrange

    // Act
    const id = ID.create();

    // Assert
    expect(id.value).to.be.a('string');
  });
});
