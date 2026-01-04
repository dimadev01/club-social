import { DateRange } from './date-range.vo';

describe('DateRange', () => {
  describe('fromDates', () => {
    it('should create DateRange from valid dates', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const end = new Date('2024-01-31T00:00:00.000Z');
      const result = DateRange.fromDates(start, end);

      expect(result.isOk()).toBe(true);
      const range = result._unsafeUnwrap();
      expect(range.start.toISOString()).toBe('2024-01-01T00:00:00.000Z');
      expect(range.end.toISOString()).toBe('2024-01-31T00:00:00.000Z');
    });

    it('should return error when start equals end', () => {
      const date = new Date('2024-01-15T00:00:00.000Z');
      const result = DateRange.fromDates(date, date);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Start date must be before end date',
      );
    });

    it('should return error when start is after end', () => {
      const start = new Date('2024-02-01T00:00:00.000Z');
      const end = new Date('2024-01-01T00:00:00.000Z');
      const result = DateRange.fromDates(start, end);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Start date must be before end date',
      );
    });

    it('should return error for invalid start date', () => {
      const start = new Date('invalid');
      const end = new Date('2024-01-31T00:00:00.000Z');
      const result = DateRange.fromDates(start, end);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe('Invalid start date');
    });

    it('should return error for invalid end date', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const end = new Date('invalid');
      const result = DateRange.fromDates(start, end);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe('Invalid end date');
    });
  });

  describe('fromUserInput', () => {
    it('should create DateRange from user input strings', () => {
      const result = DateRange.fromUserInput('2024-01-01', '2024-01-15');

      expect(result.isOk()).toBe(true);
      const range = result._unsafeUnwrap();
      expect(range.start.toISOString()).toBe('2024-01-01T00:00:00.000Z');
      // End should be start of next day for half-open interval
      expect(range.end.toISOString()).toBe('2024-01-16T00:00:00.000Z');
    });

    it('should allow same start and end date', () => {
      const result = DateRange.fromUserInput('2024-01-15', '2024-01-15');

      expect(result.isOk()).toBe(true);
      const range = result._unsafeUnwrap();
      expect(range.start.toISOString()).toBe('2024-01-15T00:00:00.000Z');
      expect(range.end.toISOString()).toBe('2024-01-16T00:00:00.000Z');
    });

    it('should return error when start is after end', () => {
      const result = DateRange.fromUserInput('2024-01-20', '2024-01-15');

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Start date must be before or equal to end date',
      );
    });

    it('should return error for invalid start date string', () => {
      const result = DateRange.fromUserInput('not-a-date', '2024-01-15');

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe('Invalid start date');
    });

    it('should return error for invalid end date string', () => {
      const result = DateRange.fromUserInput('2024-01-01', 'not-a-date');

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe('Invalid end date');
    });
  });

  describe('raw', () => {
    it('should create DateRange without validation', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const end = new Date('2024-01-31T00:00:00.000Z');
      const range = DateRange.raw({ end, start });

      expect(range.start).toEqual(start);
      expect(range.end).toEqual(end);
    });
  });

  describe('contains', () => {
    const start = new Date('2024-01-01T00:00:00.000Z');
    const end = new Date('2024-01-31T00:00:00.000Z');
    const range = DateRange.raw({ end, start });

    it('should return true for date within range', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');

      expect(range.contains(date)).toBe(true);
    });

    it('should return true for date at start (inclusive)', () => {
      expect(range.contains(start)).toBe(true);
    });

    it('should return false for date at end (exclusive)', () => {
      expect(range.contains(end)).toBe(false);
    });

    it('should return false for date before range', () => {
      const date = new Date('2023-12-31T23:59:59.999Z');

      expect(range.contains(date)).toBe(false);
    });

    it('should return false for date after range', () => {
      const date = new Date('2024-02-01T00:00:00.000Z');

      expect(range.contains(date)).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for ranges with same dates', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const end = new Date('2024-01-31T00:00:00.000Z');
      const range1 = DateRange.raw({ end, start });
      const range2 = DateRange.raw({
        end: new Date('2024-01-31T00:00:00.000Z'),
        start: new Date('2024-01-01T00:00:00.000Z'),
      });

      expect(range1.equals(range2)).toBe(true);
    });

    it('should return false for ranges with different start dates', () => {
      const end = new Date('2024-01-31T00:00:00.000Z');
      const range1 = DateRange.raw({
        end,
        start: new Date('2024-01-01T00:00:00.000Z'),
      });
      const range2 = DateRange.raw({
        end,
        start: new Date('2024-01-02T00:00:00.000Z'),
      });

      expect(range1.equals(range2)).toBe(false);
    });

    it('should return false for ranges with different end dates', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const range1 = DateRange.raw({
        end: new Date('2024-01-31T00:00:00.000Z'),
        start,
      });
      const range2 = DateRange.raw({
        end: new Date('2024-01-30T00:00:00.000Z'),
        start,
      });

      expect(range1.equals(range2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const range = DateRange.raw({
        end: new Date('2024-01-31T00:00:00.000Z'),
        start: new Date('2024-01-01T00:00:00.000Z'),
      });

      expect(range.equals(undefined)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return formatted range string', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const end = new Date('2024-01-31T00:00:00.000Z');
      const range = DateRange.raw({ end, start });

      expect(range.toString()).toBe(
        '[2024-01-01T00:00:00.000Z, 2024-01-31T00:00:00.000Z)',
      );
    });
  });
});
