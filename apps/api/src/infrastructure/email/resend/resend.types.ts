export interface VerifyWebhookParams {
  id: string;
  payload: string;
  signature: string;
  timestamp: string;
}

export const ResendCriticalEmailTemplate = {
  SEND_MAGIC_LINK: 'send-magic-link',
  SEND_VERIFICATION_EMAIL: 'send-verification-email',
} as const;

export type ResendCriticalEmailTemplate =
  (typeof ResendCriticalEmailTemplate)[keyof typeof ResendCriticalEmailTemplate];

export const ResendNotificationEmailTemplate = {
  NEW_DUE: 'new-due',
  NEW_PAYMENT: 'new-payment',
} as const;

export type ResendEmailTemplate =
  | ResendCriticalEmailTemplate
  | ResendNotificationEmailTemplate;

export type ResendNotificationEmailTemplate =
  (typeof ResendNotificationEmailTemplate)[keyof typeof ResendNotificationEmailTemplate];

export const ResendWebhookEventType = {
  EMAIL_BOUNCED: 'email.bounced',
  EMAIL_COMPLAINED: 'email.complained',
  EMAIL_DELIVERED: 'email.delivered',
  EMAIL_FAILED: 'email.failed',
} as const;

export type ResendWebhookEventType =
  (typeof ResendWebhookEventType)[keyof typeof ResendWebhookEventType];
