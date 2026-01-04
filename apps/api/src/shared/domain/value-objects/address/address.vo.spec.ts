import { Address } from './address.vo';

describe('Address', () => {
  describe('create', () => {
    it('should create a full address', () => {
      const result = Address.create({
        cityName: 'Springfield',
        stateName: 'IL',
        street: '123 Main St',
        zipCode: '62701',
      });

      expect(result.isOk()).toBe(true);
      const address = result._unsafeUnwrap();
      expect(address.street).toBe('123 Main St');
      expect(address.cityName).toBe('Springfield');
      expect(address.stateName).toBe('IL');
      expect(address.zipCode).toBe('62701');
    });

    it('should trim whitespace from all fields', () => {
      const result = Address.create({
        cityName: '  Springfield  ',
        stateName: '  IL  ',
        street: '  123 Main St  ',
        zipCode: '  62701  ',
      });

      expect(result.isOk()).toBe(true);
      const address = result._unsafeUnwrap();
      expect(address.street).toBe('123 Main St');
      expect(address.cityName).toBe('Springfield');
      expect(address.stateName).toBe('IL');
      expect(address.zipCode).toBe('62701');
    });

    it('should accept null values for all fields', () => {
      const result = Address.create({
        cityName: null,
        stateName: null,
        street: null,
        zipCode: null,
      });

      expect(result.isOk()).toBe(true);
      const address = result._unsafeUnwrap();
      expect(address.street).toBeNull();
      expect(address.cityName).toBeNull();
      expect(address.stateName).toBeNull();
      expect(address.zipCode).toBeNull();
    });

    it('should accept partial address with some null values', () => {
      const result = Address.create({
        cityName: 'Springfield',
        stateName: null,
        street: '123 Main St',
        zipCode: null,
      });

      expect(result.isOk()).toBe(true);
      const address = result._unsafeUnwrap();
      expect(address.street).toBe('123 Main St');
      expect(address.cityName).toBe('Springfield');
      expect(address.stateName).toBeNull();
      expect(address.zipCode).toBeNull();
    });
  });

  describe('raw', () => {
    it('should create address without trimming', () => {
      const address = Address.raw({
        cityName: '  city  ',
        stateName: '  state  ',
        street: '  untrimmed  ',
        zipCode: '  zip  ',
      });

      expect(address.street).toBe('  untrimmed  ');
      expect(address.cityName).toBe('  city  ');
    });
  });

  describe('toString', () => {
    it('should format full address with commas', () => {
      const address = Address.raw({
        cityName: 'Springfield',
        stateName: 'IL',
        street: '123 Main St',
        zipCode: '62701',
      });

      expect(address.toString()).toBe('123 Main St, Springfield, IL, 62701');
    });

    it('should skip null values in formatting', () => {
      const address = Address.raw({
        cityName: null,
        stateName: 'IL',
        street: '123 Main St',
        zipCode: null,
      });

      expect(address.toString()).toBe('123 Main St, IL');
    });

    it('should skip empty strings in formatting', () => {
      const address = Address.raw({
        cityName: '',
        stateName: 'IL',
        street: '123 Main St',
        zipCode: '',
      });

      expect(address.toString()).toBe('123 Main St, IL');
    });

    it('should return empty string for all null address', () => {
      const address = Address.raw({
        cityName: null,
        stateName: null,
        street: null,
        zipCode: null,
      });

      expect(address.toString()).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for addresses with same values', () => {
      const address1 = Address.raw({
        cityName: 'Springfield',
        stateName: 'IL',
        street: '123 Main St',
        zipCode: '62701',
      });
      const address2 = Address.raw({
        cityName: 'Springfield',
        stateName: 'IL',
        street: '123 Main St',
        zipCode: '62701',
      });

      expect(address1.equals(address2)).toBe(true);
    });

    it('should return false for addresses with different values', () => {
      const address1 = Address.raw({
        cityName: 'Springfield',
        stateName: 'IL',
        street: '123 Main St',
        zipCode: '62701',
      });
      const address2 = Address.raw({
        cityName: 'Springfield',
        stateName: 'IL',
        street: '456 Oak Ave',
        zipCode: '62701',
      });

      expect(address1.equals(address2)).toBe(false);
    });

    it('should return true for two all-null addresses', () => {
      const address1 = Address.raw({
        cityName: null,
        stateName: null,
        street: null,
        zipCode: null,
      });
      const address2 = Address.raw({
        cityName: null,
        stateName: null,
        street: null,
        zipCode: null,
      });

      expect(address1.equals(address2)).toBe(true);
    });
  });
});
