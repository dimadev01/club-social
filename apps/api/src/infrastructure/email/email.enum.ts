export const QueueEmailType = {
  SEND_MAGIC_LINK: 'send-magic-link',
  SEND_NEW_DUE_MOVEMENT: 'send-new-due-movement',
  SEND_NEW_PAYMENT: 'send-new-payment',
  SEND_VERIFICATION_EMAIL: 'send-verification-email',
} as const;

export type QueueEmailType =
  (typeof QueueEmailType)[keyof typeof QueueEmailType];
