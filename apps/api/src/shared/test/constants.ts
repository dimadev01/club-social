// User constants
export const TEST_EMAIL = 'test@example.com';
export const TEST_FIRST_NAME = 'John';
export const TEST_LAST_NAME = 'Doe';
export const TEST_CREATED_BY = 'admin';

// Member constants
export const TEST_ADDRESS = {
  cityName: 'Buenos Aires',
  stateName: 'CABA',
  street: 'Av. Corrientes 1234',
  zipCode: '1000',
} as const;

export const TEST_BIRTH_DATE = '1990-05-15';
export const TEST_DOCUMENT_ID = '12345678';
export const TEST_PHONE = '+54 11 1234-5678';

// Alternative values for tests that need different data
export const TEST_ALT_EMAIL = 'alt@example.com';
export const TEST_ALT_FIRST_NAME = 'Jane';
export const TEST_ALT_LAST_NAME = 'Smith';

export const TEST_ALT_ADDRESS = {
  cityName: 'Córdoba',
  stateName: 'Córdoba',
  street: 'Av. Colón 500',
  zipCode: '5000',
} as const;

export const TEST_ALT_BIRTH_DATE = '1985-03-20';
export const TEST_ALT_DOCUMENT_ID = '87654321';
export const TEST_ALT_PHONE = '+54 351 123-4567';
