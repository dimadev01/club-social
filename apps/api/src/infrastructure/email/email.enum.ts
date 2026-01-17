export const QueueEmailType = {
  SEND_MAGIC_LINK: 'send-magic-link',
  SEND_VERIFICATION_EMAIL: 'send-verification-email',
} as const;

export type QueueEmailType =
  (typeof QueueEmailType)[keyof typeof QueueEmailType];
