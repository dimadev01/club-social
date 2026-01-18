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

// Due constants
export const TEST_DUE_AMOUNT_CENTS = 10000;
export const TEST_DUE_DATE = '2024-01-15';
export const TEST_DUE_NOTES = 'Monthly membership';

// Alternative due values
export const TEST_ALT_DUE_AMOUNT_CENTS = 15000;
export const TEST_ALT_DUE_DATE = '2024-02-01';
export const TEST_ALT_DUE_NOTES = 'Updated notes';

// Due settlement constants
export const TEST_DUE_SETTLEMENT_AMOUNT_CENTS = 5000;

// Alternative due settlement values
export const TEST_ALT_DUE_SETTLEMENT_AMOUNT_CENTS = 3000;

// Movement constants
export const TEST_MOVEMENT_INFLOW_AMOUNT_CENTS = 10000;
export const TEST_MOVEMENT_OUTFLOW_AMOUNT_CENTS = -5000;
export const TEST_MOVEMENT_DATE = '2024-01-15';
export const TEST_MOVEMENT_INFLOW_NOTES = 'Manual inflow';
export const TEST_MOVEMENT_OUTFLOW_NOTES = 'Manual outflow';

// Alternative movement values
export const TEST_ALT_MOVEMENT_AMOUNT_CENTS = 7500;
export const TEST_ALT_MOVEMENT_DATE = '2024-02-01';
export const TEST_ALT_MOVEMENT_NOTES = 'Buffet sale';

// Payment constants
export const TEST_PAYMENT_AMOUNT_CENTS = 10000;
export const TEST_PAYMENT_DATE = '2024-01-15';
export const TEST_PAYMENT_NOTES = 'Test payment';
export const TEST_PAYMENT_RECEIPT_NUMBER = 'REC-001';

// Alternative payment values
export const TEST_ALT_PAYMENT_AMOUNT_CENTS = 5000;
export const TEST_ALT_PAYMENT_DATE = '2024-02-20';
export const TEST_ALT_PAYMENT_NOTES = 'Persisted payment';
export const TEST_ALT_PAYMENT_RECEIPT_NUMBER = 'REC-002';

// Pricing constants
export const TEST_PRICING_AMOUNT_CENTS = 50000;
export const TEST_PRICING_EFFECTIVE_FROM = '2024-01-01';

// Alternative pricing values
export const TEST_ALT_PRICING_AMOUNT_CENTS = 75000;
export const TEST_ALT_PRICING_EFFECTIVE_FROM = '2024-03-01';
export const TEST_ALT_PRICING_EFFECTIVE_TO = '2024-06-30';

// Notification constants
export const TEST_NOTIFICATION_RECIPIENT = 'recipient@example.com';
export const TEST_NOTIFICATION_PAYLOAD = {
  html: '<p>Test content</p>',
  subject: 'Test Subject',
} as const;
export const TEST_NOTIFICATION_SOURCE_ENTITY = 'Due';
export const TEST_NOTIFICATION_PROVIDER_MESSAGE_ID = 'msg-123456';
export const TEST_NOTIFICATION_ERROR = 'Email delivery failed';
