import { Guard } from './guards';

describe('Guard', () => {
  describe('type guard functions', () => {
    describe('isArray', () => {
      it('should return true for arrays', () => {
        expect(Guard.isArray([])).toBe(true);
        expect(Guard.isArray([1, 2, 3])).toBe(true);
        expect(Guard.isArray(['a', 'b'])).toBe(true);
      });

      it('should return false for non-arrays', () => {
        expect(Guard.isArray('array')).toBe(false);
        expect(Guard.isArray(123)).toBe(false);
        expect(Guard.isArray({})).toBe(false);
        expect(Guard.isArray(null)).toBe(false);
        expect(Guard.isArray(undefined)).toBe(false);
      });
    });

    describe('isBoolean', () => {
      it('should return true for booleans', () => {
        expect(Guard.isBoolean(true)).toBe(true);
        expect(Guard.isBoolean(false)).toBe(true);
      });

      it('should return false for non-booleans', () => {
        expect(Guard.isBoolean('true')).toBe(false);
        expect(Guard.isBoolean(1)).toBe(false);
        expect(Guard.isBoolean(0)).toBe(false);
        expect(Guard.isBoolean(null)).toBe(false);
        expect(Guard.isBoolean(undefined)).toBe(false);
      });
    });

    describe('isDate', () => {
      it('should return true for Date objects', () => {
        expect(Guard.isDate(new Date())).toBe(true);
        expect(Guard.isDate(new Date('2024-01-01'))).toBe(true);
      });

      it('should return false for non-Date objects', () => {
        expect(Guard.isDate('2024-01-01')).toBe(false);
        expect(Guard.isDate(1704067200000)).toBe(false);
        expect(Guard.isDate(null)).toBe(false);
        expect(Guard.isDate(undefined)).toBe(false);
        expect(Guard.isDate({})).toBe(false);
      });
    });

    describe('isError', () => {
      it('should return true for Error objects', () => {
        expect(Guard.isError(new Error())).toBe(true);
        expect(Guard.isError(new Error('message'))).toBe(true);
        expect(Guard.isError(new TypeError('type error'))).toBe(true);
      });

      it('should return false for non-Error objects', () => {
        expect(Guard.isError('error')).toBe(false);
        expect(Guard.isError({ message: 'error' })).toBe(false);
        expect(Guard.isError(null)).toBe(false);
        expect(Guard.isError(undefined)).toBe(false);
      });
    });

    describe('isNil', () => {
      it('should return true for null and undefined', () => {
        expect(Guard.isNil(null)).toBe(true);
        expect(Guard.isNil(undefined)).toBe(true);
      });

      it('should return false for other values', () => {
        expect(Guard.isNil('')).toBe(false);
        expect(Guard.isNil(0)).toBe(false);
        expect(Guard.isNil(false)).toBe(false);
        expect(Guard.isNil([])).toBe(false);
        expect(Guard.isNil({})).toBe(false);
      });
    });

    describe('isNull', () => {
      it('should return true for null', () => {
        expect(Guard.isNull(null)).toBe(true);
      });

      it('should return false for undefined and other values', () => {
        expect(Guard.isNull(undefined)).toBe(false);
        expect(Guard.isNull('')).toBe(false);
        expect(Guard.isNull(0)).toBe(false);
        expect(Guard.isNull(false)).toBe(false);
      });
    });

    describe('isNumber', () => {
      it('should return true for numbers', () => {
        expect(Guard.isNumber(0)).toBe(true);
        expect(Guard.isNumber(123)).toBe(true);
        expect(Guard.isNumber(-456)).toBe(true);
        expect(Guard.isNumber(3.14)).toBe(true);
        expect(Guard.isNumber(NaN)).toBe(true);
        expect(Guard.isNumber(Infinity)).toBe(true);
      });

      it('should return false for non-numbers', () => {
        expect(Guard.isNumber('123')).toBe(false);
        expect(Guard.isNumber(null)).toBe(false);
        expect(Guard.isNumber(undefined)).toBe(false);
        expect(Guard.isNumber([])).toBe(false);
      });
    });

    describe('isObject', () => {
      it('should return true for objects', () => {
        expect(Guard.isObject({})).toBe(true);
        expect(Guard.isObject({ key: 'value' })).toBe(true);
        expect(Guard.isObject([])).toBe(true);
        expect(Guard.isObject(new Date())).toBe(true);
      });

      it('should return false for null and non-objects', () => {
        expect(Guard.isObject(null)).toBe(false);
        expect(Guard.isObject(undefined)).toBe(false);
        expect(Guard.isObject('object')).toBe(false);
        expect(Guard.isObject(123)).toBe(false);
      });
    });

    describe('isString', () => {
      it('should return true for strings', () => {
        expect(Guard.isString('')).toBe(true);
        expect(Guard.isString('hello')).toBe(true);
        expect(Guard.isString('123')).toBe(true);
      });

      it('should return false for non-strings', () => {
        expect(Guard.isString(123)).toBe(false);
        expect(Guard.isString(null)).toBe(false);
        expect(Guard.isString(undefined)).toBe(false);
        expect(Guard.isString([])).toBe(false);
        expect(Guard.isString({})).toBe(false);
      });
    });

    describe('isUndefined', () => {
      it('should return true for undefined', () => {
        expect(Guard.isUndefined(undefined)).toBe(true);
      });

      it('should return false for null and other values', () => {
        expect(Guard.isUndefined(null)).toBe(false);
        expect(Guard.isUndefined('')).toBe(false);
        expect(Guard.isUndefined(0)).toBe(false);
        expect(Guard.isUndefined(false)).toBe(false);
      });
    });
  });

  describe('assertion functions', () => {
    describe('array', () => {
      it('should not throw for arrays', () => {
        expect(() => Guard.array([])).not.toThrow();
        expect(() => Guard.array([1, 2, 3])).not.toThrow();
      });

      it('should throw for non-arrays', () => {
        expect(() => Guard.array('not an array')).toThrow(
          'Target is not an array',
        );
        expect(() => Guard.array(null)).toThrow('Target is not an array');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.array('test', 'Custom error')).toThrow(
          'Custom error',
        );
      });
    });

    describe('hasProperty', () => {
      it('should not throw for objects with the property', () => {
        expect(() => Guard.hasProperty({ key: 'value' }, 'key')).not.toThrow();
      });

      it('should throw for objects without the property', () => {
        expect(() => Guard.hasProperty({ key: 'value' }, 'notKey')).toThrow(
          'Target does not have property notKey',
        );
      });
    });

    describe('boolean', () => {
      it('should not throw for booleans', () => {
        expect(() => Guard.boolean(true)).not.toThrow();
        expect(() => Guard.boolean(false)).not.toThrow();
      });

      it('should throw for non-booleans', () => {
        expect(() => Guard.boolean('true')).toThrow('Target is not a boolean');
        expect(() => Guard.boolean(1)).toThrow('Target is not a boolean');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.boolean('test', 'Custom error')).toThrow(
          'Custom error',
        );
      });
    });

    describe('date', () => {
      it('should not throw for Date objects', () => {
        expect(() => Guard.date(new Date())).not.toThrow();
      });

      it('should throw for non-Date objects', () => {
        expect(() => Guard.date('2024-01-01')).toThrow('Target is not a date');
        expect(() => Guard.date(null)).toThrow('Target is not a date');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.date('test', 'Custom error')).toThrow(
          'Custom error',
        );
      });
    });

    describe('defined', () => {
      it('should not throw for defined values', () => {
        expect(() => Guard.defined('')).not.toThrow();
        expect(() => Guard.defined(0)).not.toThrow();
        expect(() => Guard.defined(false)).not.toThrow();
        expect(() => Guard.defined({})).not.toThrow();
      });

      it('should throw for null', () => {
        expect(() => Guard.defined(null)).toThrow(
          'Target is null or undefined',
        );
      });

      it('should throw for undefined', () => {
        expect(() => Guard.defined(undefined)).toThrow(
          'Target is null or undefined',
        );
      });

      it('should throw with custom message', () => {
        expect(() => Guard.defined(null, 'Custom error')).toThrow(
          'Custom error',
        );
      });
    });

    describe('nil', () => {
      it('should not throw for null or undefined', () => {
        expect(() => Guard.nil(null)).not.toThrow();
        expect(() => Guard.nil(undefined)).not.toThrow();
      });

      it('should throw for non-nil values', () => {
        expect(() => Guard.nil('')).toThrow('Target is not nil');
        expect(() => Guard.nil(0)).toThrow('Target is not nil');
        expect(() => Guard.nil(false)).toThrow('Target is not nil');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.nil('test', 'Custom error')).toThrow('Custom error');
      });
    });

    describe('null', () => {
      it('should not throw for null', () => {
        expect(() => Guard.null(null)).not.toThrow();
      });

      it('should throw for undefined and other values', () => {
        expect(() => Guard.null(undefined)).toThrow('Target is not null');
        expect(() => Guard.null('')).toThrow('Target is not null');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.null(undefined, 'Custom error')).toThrow(
          'Custom error',
        );
      });
    });

    describe('number', () => {
      it('should not throw for numbers', () => {
        expect(() => Guard.number(0)).not.toThrow();
        expect(() => Guard.number(123)).not.toThrow();
        expect(() => Guard.number(-456.78)).not.toThrow();
      });

      it('should throw for non-numbers', () => {
        expect(() => Guard.number('123')).toThrow('Target is not a number');
        expect(() => Guard.number(null)).toThrow('Target is not a number');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.number('test', 'Custom error')).toThrow(
          'Custom error',
        );
      });
    });

    describe('object', () => {
      it('should not throw for objects', () => {
        expect(() => Guard.object({})).not.toThrow();
        expect(() => Guard.object([])).not.toThrow();
        expect(() => Guard.object(new Date())).not.toThrow();
      });

      it('should throw for null and non-objects', () => {
        expect(() => Guard.object(null)).toThrow('Target is not an object');
        expect(() => Guard.object('object')).toThrow('Target is not an object');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.object(null, 'Custom error')).toThrow(
          'Custom error',
        );
      });
    });

    describe('string', () => {
      it('should not throw for strings', () => {
        expect(() => Guard.string('')).not.toThrow();
        expect(() => Guard.string('hello')).not.toThrow();
      });

      it('should throw for non-strings', () => {
        expect(() => Guard.string(123)).toThrow('Target is not a string');
        expect(() => Guard.string(null)).toThrow('Target is not a string');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.string(123, 'Custom error')).toThrow('Custom error');
      });
    });

    describe('undefined', () => {
      it('should not throw for undefined', () => {
        expect(() => Guard.undefined(undefined)).not.toThrow();
      });

      it('should throw for null and other values', () => {
        expect(() => Guard.undefined(null)).toThrow('Target is not undefined');
        expect(() => Guard.undefined('')).toThrow('Target is not undefined');
      });

      it('should throw with custom message', () => {
        expect(() => Guard.undefined(null, 'Custom error')).toThrow(
          'Custom error',
        );
      });
    });
  });
});
