import { SignedAmount } from './signed-amount.vo';

describe('SignedAmount', () => {
  describe('fromCents', () => {
    it('should create SignedAmount from positive cents', () => {
      const result = SignedAmount.fromCents(1050);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(1050);
    });

    it('should create SignedAmount from zero cents', () => {
      const result = SignedAmount.fromCents(0);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(0);
    });

    it('should create SignedAmount from negative cents', () => {
      const result = SignedAmount.fromCents(-500);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(-500);
    });

    it('should return error for non-integer cents', () => {
      const result = SignedAmount.fromCents(10.5);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount in cents must be an integer',
      );
    });

    it('should return error for Infinity', () => {
      const result = SignedAmount.fromCents(Infinity);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount in cents must be an integer',
      );
    });

    it('should return error for amounts exceeding maximum', () => {
      const result = SignedAmount.fromCents(10_000_000_000);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount exceeds maximum allowed value',
      );
    });

    it('should accept maximum allowed value', () => {
      const result = SignedAmount.fromCents(9_999_999_999);

      expect(result.isOk()).toBe(true);
    });
  });

  describe('fromDollars', () => {
    it('should create SignedAmount from positive dollars', () => {
      const result = SignedAmount.fromDollars(10.5);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(1050);
    });

    it('should create SignedAmount from negative dollars', () => {
      const result = SignedAmount.fromDollars(-5.25);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(-525);
    });

    it('should handle zero dollars', () => {
      const result = SignedAmount.fromDollars(0);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(0);
    });

    it('should reject values with too many decimal places', () => {
      // The implementation rejects values that differ by more than 0.001 when reconstructed
      const result = SignedAmount.fromDollars(10.555);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount has too many decimal places (max 2 allowed)',
      );
    });

    it('should return error for too many decimal places', () => {
      const result = SignedAmount.fromDollars(10.5555);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount has too many decimal places (max 2 allowed)',
      );
    });

    it('should return error for Infinity', () => {
      const result = SignedAmount.fromDollars(Infinity);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Amount must be a finite number',
      );
    });
  });

  describe('raw', () => {
    it('should create SignedAmount without validation', () => {
      const amount = SignedAmount.raw({ cents: 99999 });

      expect(amount.cents).toBe(99999);
    });
  });

  describe('ZERO', () => {
    it('should be zero', () => {
      expect(SignedAmount.ZERO.cents).toBe(0);
      expect(SignedAmount.ZERO.isZero()).toBe(true);
    });
  });

  describe('toCents', () => {
    it('should return the cents value', () => {
      const amount = SignedAmount.raw({ cents: 1250 });

      expect(amount.toCents()).toBe(1250);
    });
  });

  describe('toDollars', () => {
    it('should convert cents to dollars', () => {
      const amount = SignedAmount.raw({ cents: 1050 });

      expect(amount.toDollars()).toBe(10.5);
    });

    it('should handle negative amounts', () => {
      const amount = SignedAmount.raw({ cents: -525 });

      expect(amount.toDollars()).toBe(-5.25);
    });
  });

  describe('add', () => {
    it('should add two amounts', () => {
      const amount1 = SignedAmount.raw({ cents: 1000 });
      const amount2 = SignedAmount.raw({ cents: 500 });
      const result = amount1.add(amount2);

      expect(result.cents).toBe(1500);
    });

    it('should handle adding negative amounts', () => {
      const amount1 = SignedAmount.raw({ cents: 1000 });
      const amount2 = SignedAmount.raw({ cents: -300 });
      const result = amount1.add(amount2);

      expect(result.cents).toBe(700);
    });
  });

  describe('subtract', () => {
    it('should subtract and return result when positive', () => {
      const amount1 = SignedAmount.raw({ cents: 1000 });
      const amount2 = SignedAmount.raw({ cents: 300 });
      const result = amount1.subtract(amount2);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(700);
    });

    it('should return error when result would be negative', () => {
      const amount1 = SignedAmount.raw({ cents: 300 });
      const amount2 = SignedAmount.raw({ cents: 500 });
      const result = amount1.subtract(amount2);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Subtraction would result in negative amount',
      );
    });

    it('should allow subtracting to zero', () => {
      const amount1 = SignedAmount.raw({ cents: 500 });
      const amount2 = SignedAmount.raw({ cents: 500 });
      const result = amount1.subtract(amount2);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(0);
    });
  });

  describe('multiply', () => {
    it('should multiply by a positive factor', () => {
      const amount = SignedAmount.raw({ cents: 1000 });
      const result = amount.multiply(2);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(2000);
    });

    it('should multiply by a decimal factor', () => {
      const amount = SignedAmount.raw({ cents: 1000 });
      const result = amount.multiply(0.5);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(500);
    });

    it('should round to nearest cent', () => {
      const amount = SignedAmount.raw({ cents: 100 });
      const result = amount.multiply(0.333);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(33);
    });

    it('should return error for negative factor', () => {
      const amount = SignedAmount.raw({ cents: 1000 });
      const result = amount.multiply(-2);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toBe(
        'Multiplication factor cannot be negative',
      );
    });

    it('should handle multiplying by zero', () => {
      const amount = SignedAmount.raw({ cents: 1000 });
      const result = amount.multiply(0);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().cents).toBe(0);
    });
  });

  describe('comparison methods', () => {
    const small = SignedAmount.raw({ cents: 100 });
    const medium = SignedAmount.raw({ cents: 500 });
    const large = SignedAmount.raw({ cents: 1000 });
    const equalToSmall = SignedAmount.raw({ cents: 100 });

    describe('isGreaterThan', () => {
      it('should return true when greater', () => {
        expect(large.isGreaterThan(medium)).toBe(true);
      });

      it('should return false when lesser', () => {
        expect(small.isGreaterThan(medium)).toBe(false);
      });

      it('should return false when equal', () => {
        expect(small.isGreaterThan(equalToSmall)).toBe(false);
      });
    });

    describe('isGreaterThanOrEqual', () => {
      it('should return true when greater', () => {
        expect(large.isGreaterThanOrEqual(medium)).toBe(true);
      });

      it('should return true when equal', () => {
        expect(small.isGreaterThanOrEqual(equalToSmall)).toBe(true);
      });

      it('should return false when lesser', () => {
        expect(small.isGreaterThanOrEqual(medium)).toBe(false);
      });
    });

    describe('isLessThan', () => {
      it('should return true when lesser', () => {
        expect(small.isLessThan(medium)).toBe(true);
      });

      it('should return false when greater', () => {
        expect(large.isLessThan(medium)).toBe(false);
      });

      it('should return false when equal', () => {
        expect(small.isLessThan(equalToSmall)).toBe(false);
      });
    });

    describe('isLessThanOrEqual', () => {
      it('should return true when lesser', () => {
        expect(small.isLessThanOrEqual(medium)).toBe(true);
      });

      it('should return true when equal', () => {
        expect(small.isLessThanOrEqual(equalToSmall)).toBe(true);
      });

      it('should return false when greater', () => {
        expect(large.isLessThanOrEqual(medium)).toBe(false);
      });
    });
  });

  describe('sign methods', () => {
    const positive = SignedAmount.raw({ cents: 500 });
    const negative = SignedAmount.raw({ cents: -500 });
    const zero = SignedAmount.raw({ cents: 0 });

    describe('isPositive', () => {
      it('should return true for positive amounts', () => {
        expect(positive.isPositive()).toBe(true);
      });

      it('should return false for negative amounts', () => {
        expect(negative.isPositive()).toBe(false);
      });

      it('should return false for zero', () => {
        expect(zero.isPositive()).toBe(false);
      });
    });

    describe('isNegative', () => {
      it('should return true for negative amounts', () => {
        expect(negative.isNegative()).toBe(true);
      });

      it('should return false for positive amounts', () => {
        expect(positive.isNegative()).toBe(false);
      });

      it('should return false for zero', () => {
        expect(zero.isNegative()).toBe(false);
      });
    });

    describe('isZero', () => {
      it('should return true for zero', () => {
        expect(zero.isZero()).toBe(true);
      });

      it('should return false for positive amounts', () => {
        expect(positive.isZero()).toBe(false);
      });

      it('should return false for negative amounts', () => {
        expect(negative.isZero()).toBe(false);
      });
    });
  });

  describe('toNegative', () => {
    it('should convert positive to negative', () => {
      const amount = SignedAmount.raw({ cents: 500 });
      const result = amount.toNegative();

      expect(result.cents).toBe(-500);
    });

    it('should convert negative to positive', () => {
      const amount = SignedAmount.raw({ cents: -500 });
      const result = amount.toNegative();

      expect(result.cents).toBe(500);
    });

    it('should keep zero as negative zero', () => {
      const amount = SignedAmount.raw({ cents: 0 });
      const result = amount.toNegative();

      // JavaScript: -0 is equal to 0 but Object.is(-0, 0) is false
      expect(result.cents).toEqual(-0);
    });
  });

  describe('toPositive', () => {
    it('should keep positive as positive', () => {
      const amount = SignedAmount.raw({ cents: 500 });
      const result = amount.toPositive();

      expect(result.cents).toBe(500);
    });

    it('should convert negative to positive', () => {
      const amount = SignedAmount.raw({ cents: -500 });
      const result = amount.toPositive();

      expect(result.cents).toBe(500);
    });

    it('should keep zero as zero', () => {
      const amount = SignedAmount.raw({ cents: 0 });
      const result = amount.toPositive();

      expect(result.cents).toBe(0);
    });
  });

  describe('equals', () => {
    it('should return true for same cents value', () => {
      const amount1 = SignedAmount.raw({ cents: 1050 });
      const amount2 = SignedAmount.raw({ cents: 1050 });

      expect(amount1.equals(amount2)).toBe(true);
    });

    it('should return false for different cents values', () => {
      const amount1 = SignedAmount.raw({ cents: 1050 });
      const amount2 = SignedAmount.raw({ cents: 1051 });

      expect(amount1.equals(amount2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const amount = SignedAmount.raw({ cents: 1050 });

      expect(amount.equals(undefined)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return formatted dollar string', () => {
      const amount = SignedAmount.raw({ cents: 1050 });

      expect(amount.toString()).toBe('10.50');
    });

    it('should handle negative amounts', () => {
      const amount = SignedAmount.raw({ cents: -525 });

      expect(amount.toString()).toBe('-5.25');
    });

    it('should handle zero', () => {
      const amount = SignedAmount.raw({ cents: 0 });

      expect(amount.toString()).toBe('0.00');
    });

    it('should always show two decimal places', () => {
      const amount = SignedAmount.raw({ cents: 1000 });

      expect(amount.toString()).toBe('10.00');
    });
  });
});
