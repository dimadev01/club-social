import { err, ok, ResultUtils } from './result';

describe('result', () => {
  describe('ok', () => {
    it('should create an ok result with a value', () => {
      const result = ok(42);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBe(42);
    });

    it('should create an ok result with undefined when no value is provided', () => {
      const result = ok();

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toBeUndefined();
    });
  });

  describe('err', () => {
    it('should create an err result with the provided error', () => {
      const error = new Error('boom');
      const result = err(error);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe(error);
    });
  });

  describe('ResultUtils.combine', () => {
    it('should combine ok results into an ok array', () => {
      const result = ResultUtils.combine([ok(1), ok(2)]);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual([1, 2]);
    });

    it('should return err when any result is err', () => {
      const error = new Error('combine failed');
      const result = ResultUtils.combine([ok(1), err(error)]);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe(error);
    });
  });

  describe('ResultUtils.combineAsync', () => {
    it('should combine async ok results into an ok array', async () => {
      const result = await ResultUtils.combineAsync([
        Promise.resolve(ok(1)),
        ok(2),
      ]);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual([1, 2]);
    });

    it('should return err when any async result is err', async () => {
      const error = new Error('async combine failed');
      const result = await ResultUtils.combineAsync([
        ok(1),
        Promise.resolve(err(error)),
      ]);

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe(error);
    });
  });
});
