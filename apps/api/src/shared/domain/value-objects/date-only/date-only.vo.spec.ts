import { DateOnly } from './date-only.vo';

describe('DateOnly', () => {
  describe('fromString', () => {
    it('should create DateOnly from valid YYYY-MM-DD string', () => {
      const result = DateOnly.fromString('2024-06-15');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe('2024-06-15');
    });

    it('should accept first day of month', () => {
      const result = DateOnly.fromString('2024-01-01');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe('2024-01-01');
    });

    it('should accept last day of month', () => {
      const result = DateOnly.fromString('2024-12-31');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe('2024-12-31');
    });

    it('should accept leap year date', () => {
      const result = DateOnly.fromString('2024-02-29');

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe('2024-02-29');
    });

    it('should return error for invalid format (MM-DD-YYYY)', () => {
      const result = DateOnly.fromString('06-15-2024');

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Date must be in YYYY-MM-DD format',
      );
    });

    it('should return error for invalid format (slash separator)', () => {
      const result = DateOnly.fromString('2024/06/15');

      expect(result.isErr()).toBe(true);
    });

    it('should return error for invalid date (Feb 30)', () => {
      const result = DateOnly.fromString('2024-02-30');

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe('Invalid date');
    });

    it('should return error for invalid date (Feb 29 non-leap year)', () => {
      const result = DateOnly.fromString('2023-02-29');

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe('Invalid date');
    });

    it('should return error for invalid month', () => {
      const result = DateOnly.fromString('2024-13-01');

      expect(result.isErr()).toBe(true);
    });

    it('should return error for invalid day', () => {
      const result = DateOnly.fromString('2024-06-32');

      expect(result.isErr()).toBe(true);
    });
  });

  describe('fromDate', () => {
    it('should create DateOnly from Date object', () => {
      const date = new Date('2024-06-15T10:30:00.000Z');
      const result = DateOnly.fromDate(date);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe('2024-06-15');
    });

    it('should ignore time portion of Date', () => {
      const date = new Date('2024-06-15T23:59:59.999Z');
      const result = DateOnly.fromDate(date);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe('2024-06-15');
    });

    it('should return error for invalid Date', () => {
      const date = new Date('invalid');
      const result = DateOnly.fromDate(date);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe('Invalid date');
    });
  });

  describe('raw', () => {
    it('should create DateOnly without validation', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-15' });

      expect(dateOnly.value).toBe('2024-06-15');
    });

    it('should accept any string without validation', () => {
      const dateOnly = DateOnly.raw({ value: 'not-a-date' });

      expect(dateOnly.value).toBe('not-a-date');
    });
  });

  describe('today', () => {
    it('should create DateOnly for current date', () => {
      const today = DateOnly.today();
      const expectedFormat = /^\d{4}-\d{2}-\d{2}$/;

      expect(today.value).toMatch(expectedFormat);
    });
  });

  describe('toDate', () => {
    it('should convert to Date at midnight UTC', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-15' });
      const date = dateOnly.toDate();

      expect(date.toISOString()).toBe('2024-06-15T00:00:00.000Z');
    });
  });

  describe('addMonths', () => {
    it('should add months correctly', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-15' });
      const result = dateOnly.addMonths(2);

      expect(result.value).toBe('2024-08-15');
    });

    it('should handle year rollover', () => {
      const dateOnly = DateOnly.raw({ value: '2024-11-15' });
      const result = dateOnly.addMonths(3);

      expect(result.value).toBe('2025-02-15');
    });

    it('should handle adding negative months', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-15' });
      const result = dateOnly.addMonths(-2);

      expect(result.value).toBe('2024-04-15');
    });
  });

  describe('subtractDays', () => {
    it('should subtract days correctly', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-15' });
      const result = dateOnly.subtractDays(5);

      expect(result.value).toBe('2024-06-10');
    });

    it('should handle month rollover', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-05' });
      const result = dateOnly.subtractDays(10);

      expect(result.value).toBe('2024-05-26');
    });
  });

  describe('startOfMonth', () => {
    it('should return first day of the month', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-15' });
      const result = dateOnly.startOfMonth();

      expect(result.value).toBe('2024-06-01');
    });
  });

  describe('endOfMonth', () => {
    it('should return last day of the month', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-15' });
      const result = dateOnly.endOfMonth();

      expect(result.value).toBe('2024-06-30');
    });

    it('should return correct end for February', () => {
      const dateOnly = DateOnly.raw({ value: '2024-02-15' });
      const result = dateOnly.endOfMonth();

      expect(result.value).toBe('2024-02-29');
    });

    it('should return correct end for December', () => {
      const dateOnly = DateOnly.raw({ value: '2024-12-15' });
      const result = dateOnly.endOfMonth();

      expect(result.value).toBe('2024-12-31');
    });
  });

  describe('comparison methods', () => {
    const earlier = DateOnly.raw({ value: '2024-06-10' });
    const later = DateOnly.raw({ value: '2024-06-20' });
    const same = DateOnly.raw({ value: '2024-06-10' });

    describe('isBefore', () => {
      it('should return true when date is before', () => {
        expect(earlier.isBefore(later)).toBe(true);
      });

      it('should return false when date is after', () => {
        expect(later.isBefore(earlier)).toBe(false);
      });

      it('should return false for same date', () => {
        expect(earlier.isBefore(same)).toBe(false);
      });
    });

    describe('isAfter', () => {
      it('should return true when date is after', () => {
        expect(later.isAfter(earlier)).toBe(true);
      });

      it('should return false when date is before', () => {
        expect(earlier.isAfter(later)).toBe(false);
      });

      it('should return false for same date', () => {
        expect(earlier.isAfter(same)).toBe(false);
      });
    });

    describe('isSameOrBefore', () => {
      it('should return true when date is before', () => {
        expect(earlier.isSameOrBefore(later)).toBe(true);
      });

      it('should return true for same date', () => {
        expect(earlier.isSameOrBefore(same)).toBe(true);
      });

      it('should return false when date is after', () => {
        expect(later.isSameOrBefore(earlier)).toBe(false);
      });
    });

    describe('isSameOrAfter', () => {
      it('should return true when date is after', () => {
        expect(later.isSameOrAfter(earlier)).toBe(true);
      });

      it('should return true for same date', () => {
        expect(earlier.isSameOrAfter(same)).toBe(true);
      });

      it('should return false when date is before', () => {
        expect(earlier.isSameOrAfter(later)).toBe(false);
      });
    });
  });

  describe('equals', () => {
    it('should return true for same dates', () => {
      const date1 = DateOnly.raw({ value: '2024-06-15' });
      const date2 = DateOnly.raw({ value: '2024-06-15' });

      expect(date1.equals(date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = DateOnly.raw({ value: '2024-06-15' });
      const date2 = DateOnly.raw({ value: '2024-06-16' });

      expect(date1.equals(date2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const date = DateOnly.raw({ value: '2024-06-15' });

      expect(date.equals(undefined)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the date value', () => {
      const dateOnly = DateOnly.raw({ value: '2024-06-15' });

      expect(dateOnly.toString()).toBe('2024-06-15');
    });
  });
});
