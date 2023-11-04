export type SendEmailRequest = {
  message: string;
  subject: string;
  to: string;
};

export type SendEmailResponse = {
  success: boolean;
};
