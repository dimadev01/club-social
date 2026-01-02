import { ValueObject } from './value-object.base';

interface TestProps {
  count: number;
  value: string;
}

class TestValueObject extends ValueObject<TestProps> {
  public get count(): number {
    return this.props.count;
  }

  public get value(): string {
    return this.props.value;
  }

  public constructor(props: TestProps) {
    super(props);
  }

  public toString(): string {
    return `${this.value}:${this.count}`;
  }
}

describe('ValueObject', () => {
  describe('constructor', () => {
    it('should freeze props to ensure immutability', () => {
      const props = { count: 1, value: 'test' };
      const vo = new TestValueObject(props);

      expect(() => {
        (vo as unknown as { props: TestProps }).props.value = 'modified';
      }).toThrow();
    });

    it('should store props correctly', () => {
      const vo = new TestValueObject({ count: 42, value: 'hello' });

      expect(vo.value).toBe('hello');
      expect(vo.count).toBe(42);
    });
  });

  describe('equals', () => {
    it('should return true for value objects with same props', () => {
      const vo1 = new TestValueObject({ count: 1, value: 'test' });
      const vo2 = new TestValueObject({ count: 1, value: 'test' });

      expect(vo1.equals(vo2)).toBe(true);
    });

    it('should return false for value objects with different props', () => {
      const vo1 = new TestValueObject({ count: 1, value: 'test' });
      const vo2 = new TestValueObject({ count: 2, value: 'test' });

      expect(vo1.equals(vo2)).toBe(false);
    });

    it('should return false for value objects with different values', () => {
      const vo1 = new TestValueObject({ count: 1, value: 'test1' });
      const vo2 = new TestValueObject({ count: 1, value: 'test2' });

      expect(vo1.equals(vo2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const vo = new TestValueObject({ count: 1, value: 'test' });

      expect(vo.equals(undefined)).toBe(false);
    });

    it('should return false when comparing with null-like value', () => {
      const vo = new TestValueObject({ count: 1, value: 'test' });

      expect(vo.equals(undefined)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const vo = new TestValueObject({ count: 5, value: 'hello' });

      expect(vo.toString()).toBe('hello:5');
    });
  });
});
