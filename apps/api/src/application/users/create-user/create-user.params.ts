import type { Email } from '@/domain/shared/value-objects/email/email.vo';

export interface CreateUserParams {
  email: Email;
  firstName: string;
  lastName: string;
}
