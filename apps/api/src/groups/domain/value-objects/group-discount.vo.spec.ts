import { ApplicationError } from '@/shared/domain/errors/application.error';

import { GroupDiscount } from './group-discount.vo';

describe('GroupDiscount', () => {
  describe('create', () => {
    it('should create valid discount', () => {
      const result = GroupDiscount.create(15);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe(15);
    });

    it('should reject negative discount', () => {
      const result = GroupDiscount.create(-1);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ApplicationError);
      expect(result._unsafeUnwrapErr().message).toBe(
        'El porcentaje de descuento debe estar entre 0 y 99',
      );
    });

    it('should reject discount above 99', () => {
      const result = GroupDiscount.create(101);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ApplicationError);
      expect(result._unsafeUnwrapErr().message).toBe(
        'El porcentaje de descuento debe estar entre 0 y 99',
      );
    });

    it('should accept zero discount', () => {
      const result = GroupDiscount.create(0);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe(0);
    });

    it('should accept 99% discount', () => {
      const result = GroupDiscount.create(99);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().value).toBe(99);
    });

    it('should throw for non-number value', () => {
      expect(() => GroupDiscount.create('50' as unknown as number)).toThrow(
        'Target is not a number',
      );
    });
  });

  describe('raw', () => {
    it('should create without validation', () => {
      const discount = GroupDiscount.raw({ value: 150 });

      expect(discount.value).toBe(150);
    });

    it('should create with negative value without validation', () => {
      const discount = GroupDiscount.raw({ value: -50 });

      expect(discount.value).toBe(-50);
    });

    it('should create with decimal value without validation', () => {
      const discount = GroupDiscount.raw({ value: 50.5 });

      expect(discount.value).toBe(50.5);
    });
  });

  describe('isZero', () => {
    it('should return true for 0%', () => {
      const discount = GroupDiscount.raw({ value: 0 });

      expect(discount.isZero()).toBe(true);
    });

    it('should return false for non-zero', () => {
      const discount = GroupDiscount.raw({ value: 10 });

      expect(discount.isZero()).toBe(false);
    });

    it('should return false for negative', () => {
      const discount = GroupDiscount.raw({ value: -5 });

      expect(discount.isZero()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should equal same discount', () => {
      const discount1 = GroupDiscount.raw({ value: 15 });
      const discount2 = GroupDiscount.raw({ value: 15 });

      expect(discount1.equals(discount2)).toBe(true);
    });

    it('should not equal different discount', () => {
      const discount1 = GroupDiscount.raw({ value: 15 });
      const discount2 = GroupDiscount.raw({ value: 20 });

      expect(discount1.equals(discount2)).toBe(false);
    });

    it('should return false for undefined', () => {
      const discount = GroupDiscount.raw({ value: 15 });

      expect(discount.equals(undefined)).toBe(false);
    });

    it('should return false for different type', () => {
      const discount = GroupDiscount.raw({ value: 15 });
      const other = GroupDiscount.raw({ value: 20 });

      expect(discount.equals(other)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should format with percentage', () => {
      const discount = GroupDiscount.raw({ value: 25 });

      expect(discount.toString()).toBe('25%');
    });

    it('should format zero', () => {
      const discount = GroupDiscount.raw({ value: 0 });

      expect(discount.toString()).toBe('0%');
    });

    it('should format 100', () => {
      const discount = GroupDiscount.raw({ value: 100 });

      expect(discount.toString()).toBe('100%');
    });
  });

  describe('constants', () => {
    it('should have ZERO constant', () => {
      expect(GroupDiscount.ZERO).toBeDefined();
      expect(GroupDiscount.ZERO.value).toBe(0);
    });

    it('should have MIN_PERCENT constant', () => {
      expect(GroupDiscount.MIN_PERCENT).toBe(0);
    });

    it('should have MAX_PERCENT constant', () => {
      expect(GroupDiscount.MAX_PERCENT).toBe(99);
    });

    it('should use ZERO constant correctly', () => {
      const discount = GroupDiscount.ZERO;

      expect(discount.isZero()).toBe(true);
      expect(discount.toString()).toBe('0%');
    });
  });
});
