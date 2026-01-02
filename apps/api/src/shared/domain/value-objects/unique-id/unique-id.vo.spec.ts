import { UniqueId } from './unique-id.vo';

describe('UniqueId', () => {
  describe('generate', () => {
    it('should generate a valid UUID', () => {
      const id = UniqueId.generate();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      expect(id.value).toMatch(uuidRegex);
    });

    it('should generate unique IDs each time', () => {
      const id1 = UniqueId.generate();
      const id2 = UniqueId.generate();

      expect(id1.value).not.toBe(id2.value);
    });
  });

  describe('raw', () => {
    it('should create UniqueId from existing value', () => {
      const existingId = '123e4567-e89b-12d3-a456-426614174000';
      const id = UniqueId.raw({ value: existingId });

      expect(id.value).toBe(existingId);
    });

    it('should accept any string value without validation', () => {
      const customId = 'custom-id-123';
      const id = UniqueId.raw({ value: customId });

      expect(id.value).toBe(customId);
    });
  });

  describe('value', () => {
    it('should return the stored value', () => {
      const expectedValue = 'test-uuid-value';
      const id = UniqueId.raw({ value: expectedValue });

      expect(id.value).toBe(expectedValue);
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      const expectedValue = 'my-unique-id';
      const id = UniqueId.raw({ value: expectedValue });

      expect(id.toString()).toBe(expectedValue);
    });
  });

  describe('equals', () => {
    it('should return true for UniqueIds with same value', () => {
      const value = '123e4567-e89b-12d3-a456-426614174000';
      const id1 = UniqueId.raw({ value });
      const id2 = UniqueId.raw({ value });

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for UniqueIds with different values', () => {
      const id1 = UniqueId.raw({ value: 'id-1' });
      const id2 = UniqueId.raw({ value: 'id-2' });

      expect(id1.equals(id2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const id = UniqueId.generate();

      expect(id.equals(undefined)).toBe(false);
    });
  });
});
