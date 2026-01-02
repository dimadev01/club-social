import { Amount } from './amount.vo';

describe('Amount', () => {
  describe('fromCents', () => {
    it('should create Amount from positive cents', () => {
      const result = Amount.fromCents(1050);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(1050);
    });

    it('should create Amount from zero cents', () => {
      const result = Amount.fromCents(0);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(0);
    });

    it('should return error for negative cents', () => {
      const result = Amount.fromCents(-500);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount cannot be negative',
      );
    });

    it('should return error for non-integer cents (validation is in SignedAmount)', () => {
      // Note: Amount.fromCents only validates non-negative, integer check is in SignedAmount
      const result = Amount.fromCents(10.5);

      // This passes to SignedAmount which validates, but via ok() wrapping
      expect(result.isErr()).toBe(true);
    });
  });

  describe('fromDollars', () => {
    it('should create Amount from positive dollars', () => {
      const result = Amount.fromDollars(10.5);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(1050);
    });

    it('should create Amount from zero dollars', () => {
      const result = Amount.fromDollars(0);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(0);
    });

    it('should return error for negative dollars', () => {
      const result = Amount.fromDollars(-5.25);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount cannot be negative',
      );
    });

    it('should return error for too many decimal places', () => {
      const result = Amount.fromDollars(10.5555);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount has too many decimal places (max 2 allowed)',
      );
    });
  });

  describe('inherits SignedAmount functionality', () => {
    it('should have toDollars method', () => {
      const result = Amount.fromCents(1050);
      const amount = result._unsafeUnwrap();

      expect(amount.toDollars()).toBe(10.5);
    });

    it('should have add method', () => {
      const amount1 = Amount.fromCents(1000)._unsafeUnwrap();
      const amount2 = Amount.fromCents(500)._unsafeUnwrap();
      const result = amount1.add(amount2);

      expect(result.cents).toBe(1500);
    });

    it('should have comparison methods', () => {
      const amount1 = Amount.fromCents(1000)._unsafeUnwrap();
      const amount2 = Amount.fromCents(500)._unsafeUnwrap();

      expect(amount1.isGreaterThan(amount2)).toBe(true);
      expect(amount2.isLessThan(amount1)).toBe(true);
    });

    it('should have toString method', () => {
      const amount = Amount.fromCents(1050)._unsafeUnwrap();

      expect(amount.toString()).toBe('10.50');
    });
  });
});
