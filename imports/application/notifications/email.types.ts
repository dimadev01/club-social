export type SendEmailRequest = {
  message: string;
  to: string;
};

export type SendEmailResponse = {
  success: boolean;
};
