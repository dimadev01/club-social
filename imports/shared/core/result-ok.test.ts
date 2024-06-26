import { expect } from 'chai';

import { ok } from '@shared/core/result-ok';

describe('Result Ok', () => {
  it('should create an Ok and check isOk', () => {
    // Arrange

    // Act
    const result = ok();

    // Assert
    expect(result.isOk()).to.be.true;
  });

  it('should create an Ok and check isErr', () => {
    // Arrange

    // Act
    const result = ok();

    // Assert
    expect(result.isErr()).to.be.false;
  });

  it('should create an Ok and check the default value of null', () => {
    // Arrange

    // Act
    const result = ok();

    // Assert
    expect(result.unsafeValue()).to.be.null;
  });

  it('should create an Ok and check the value passed', () => {
    // Arrange
    const props = 123;

    // Act
    const result = ok(props);

    // Assert
    expect(result.unsafeValue()).to.be.eq(props);
  });
});
