import { Name } from './name.vo';

describe('Name', () => {
  describe('create', () => {
    it('should create a valid name', () => {
      const result = Name.create({ firstName: 'John', lastName: 'Doe' });

      expect(result.isOk()).toBe(true);
      const name = result._unsafeUnwrap();
      expect(name.firstName).toBe('John');
      expect(name.lastName).toBe('Doe');
    });

    it('should accept names with special characters', () => {
      const result = Name.create({
        firstName: 'Mary-Jane',
        lastName: "O'Connor",
      });

      expect(result.isOk()).toBe(true);
      const name = result._unsafeUnwrap();
      expect(name.firstName).toBe('Mary-Jane');
      expect(name.lastName).toBe("O'Connor");
    });

    it('should accept unicode names', () => {
      const result = Name.create({ firstName: 'José', lastName: 'García' });

      expect(result.isOk()).toBe(true);
      const name = result._unsafeUnwrap();
      expect(name.firstName).toBe('José');
      expect(name.lastName).toBe('García');
    });
  });

  describe('raw', () => {
    it('should create name without validation', () => {
      const name = Name.raw({ firstName: 'Jane', lastName: 'Smith' });

      expect(name.firstName).toBe('Jane');
      expect(name.lastName).toBe('Smith');
    });
  });

  describe('firstName', () => {
    it('should return the first name', () => {
      const name = Name.raw({ firstName: 'Alice', lastName: 'Wonder' });

      expect(name.firstName).toBe('Alice');
    });
  });

  describe('lastName', () => {
    it('should return the last name', () => {
      const name = Name.raw({ firstName: 'Alice', lastName: 'Wonder' });

      expect(name.lastName).toBe('Wonder');
    });
  });

  describe('fullName', () => {
    it('should return full name in lastName firstName format', () => {
      const name = Name.raw({ firstName: 'John', lastName: 'Doe' });

      expect(name.fullName).toBe('Doe John');
    });
  });

  describe('fullNameFirstNameFirst', () => {
    it('should return full name in firstName lastName format', () => {
      const name = Name.raw({ firstName: 'John', lastName: 'Doe' });

      expect(name.fullNameFirstNameFirst).toBe('John Doe');
    });
  });

  describe('fullNameLastNameFirst', () => {
    it('should return full name in lastName firstName format', () => {
      const name = Name.raw({ firstName: 'John', lastName: 'Doe' });

      expect(name.fullNameLastNameFirst).toBe('Doe John');
    });
  });

  describe('equals', () => {
    it('should return true for names with same values', () => {
      const name1 = Name.raw({ firstName: 'John', lastName: 'Doe' });
      const name2 = Name.raw({ firstName: 'John', lastName: 'Doe' });

      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for names with different first names', () => {
      const name1 = Name.raw({ firstName: 'John', lastName: 'Doe' });
      const name2 = Name.raw({ firstName: 'Jane', lastName: 'Doe' });

      expect(name1.equals(name2)).toBe(false);
    });

    it('should return false for names with different last names', () => {
      const name1 = Name.raw({ firstName: 'John', lastName: 'Doe' });
      const name2 = Name.raw({ firstName: 'John', lastName: 'Smith' });

      expect(name1.equals(name2)).toBe(false);
    });

    it('should return false when comparing with undefined', () => {
      const name = Name.raw({ firstName: 'John', lastName: 'Doe' });

      expect(name.equals(undefined)).toBe(false);
    });
  });
});
