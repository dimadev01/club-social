import { expect } from 'chai';

import { Entity } from '@shared/core/entity';

describe('Entity', () => {
  describe('.create()', () => {
    interface TestEntityProps {
      someProp: string;
    }

    class TestEntity extends Entity<TestEntityProps> {
      public get someProp(): string {
        return this.props.someProp;
      }

      public static create(props: TestEntityProps): TestEntity {
        return new TestEntity(props);
      }
    }

    it('should create a new Entity', () => {
      // Arrange
      const props: TestEntityProps = { someProp: 'some value' };

      // Act
      const entity = TestEntity.create(props);

      // Assert
      expect(entity.someProp).to.be.equal(props.someProp);
    });
  });
});
