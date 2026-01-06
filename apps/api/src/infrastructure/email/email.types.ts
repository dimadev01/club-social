export type EmailJobData =
  | { data: SendMagicLinkParams; type: 'send-magic-link' }
  | { data: SendNewDueMovementParams; type: 'send-new-due-movement' }
  | { data: SendNewPaymentParams; type: 'send-new-payment' }
  | { data: SendVerificationEmailParams; type: 'send-verification-email' };

export interface SendEmailParams {
  from?: string;
  html: string;
  replyTo?: string;
  subject: string;
  text?: string;
  to: string | string[];
}

export interface SendMagicLinkParams {
  email: string;
  url: string;
}

export interface SendNewDueMovementParams {
  amount: string;
  category: string;
  date: string;
  email: string;
  memberName: string;
  pendingElectricity: string;
  pendingGuest: string;
  pendingMembership: string;
  pendingTotal: string;
}

export interface SendNewPaymentParams {
  amount: string;
  date: string;
  email: string;
  memberName: string;
}

export interface SendTemplateEmailParams {
  email: string;
  template: string;
  variables: Record<string, string>;
}

export interface SendVerificationEmailParams {
  email: string;
  url: string;
}
